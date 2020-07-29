require 'rest-client'

module InventorySync
  module Async
    class InventoryFullSync < ::ApplicationJob
      def perform(organization)
        @organization = organization
        @all_hosts = Set.new(
          ForemanInventoryUpload::Generators::Queries.for_slice(Host.unscoped).pluck(:id)
        )

        InventorySync::InventoryStatus.transaction do
          InventorySync::InventoryStatus.delete_all
          page = 1
          loop do
            api_response = query_inventory(page)
            results = HostResult.new(api_response)
            update_hosts_status(results.status_hashes, results.touched)
            logger.debug("Downloading cloud inventory data: #{results.percentage}%")
            page += 1
            break if results.last?
          end
          add_missing_hosts_statuses(@all_hosts)
        end
      end

      def rh_credentials
        @rh_credentials ||= query_refresh_token
      end

      private

      def update_hosts_status(status_hashes, touched)
        InventorySync::InventoryStatus.create(status_hashes)
        @all_hosts.subtract(touched)
      end

      def add_missing_hosts_statuses(hosts_ids)
        InventorySync::InventoryStatus.create(
          hosts_ids.map do |host_id|
            {
              host_id: host_id,
              status: InventorySync::InventoryStatus::DISCONNECT,
              reported_at: DateTime.current,
            }
          end
        )
      end

      def query_inventory(page = 1)
        hosts_inventory_response = RestClient::Request.execute(
          method: :get,
          url: InventorySync.inventory_export_url,
          verify_ssl: ENV['SATELLITE_INVENTORY_CLOUD_URL'] ? OpenSSL::SSL::VERIFY_NONE : OpenSSL::SSL::VERIFY_PEER,
          headers: {
            Authorization: "Bearer #{rh_credentials}",
            params: {
              per_page: 100,
              page: page,
            },
          }
        )

        JSON.parse(hosts_inventory_response)
      end

      def query_refresh_token
        token_response = RestClient::Request.execute(
          method: :post,
          url: InventorySync.authentication_url,
          verify_ssl: ENV['SATELLITE_INVENTORY_CLOUD_URL'] ? OpenSSL::SSL::VERIFY_NONE : OpenSSL::SSL::VERIFY_PEER,
          payload: {
            grant_type: 'refresh_token',
            client_id: 'rhsm-api',
            refresh_token: Setting[:rh_cloud_token],
          }
        )

        JSON.parse(token_response)['access_token']
      rescue RestClient::ExceptionWithResponse => e
        Foreman::Logging.exception('Unable to authenticate using rh_cloud_token setting', e)
        raise ::Foreman::WrappedException.new(e, N_('Unable to authenticate using rh_cloud_token setting'))
      end
    end
  end
end
