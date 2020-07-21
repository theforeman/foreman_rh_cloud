require 'rest-client'

module InventorySync
  module Async
    class InventoryFullSync < ::ApplicationJob
      def perform(organization)
        @organization = organization
        
        loop do
          api_response = query_inventory
          results = HostResult.new(api_response)
          update_hosts_status(results.status_hashes)
          break if results.last?
        end
      end

      def rh_credentials
        @rh_credentials ||= query_refresh_token
      end

      private

      def update_hosts_status(status_hashes)
        # update the actual host status
      end

      def query_inventory(page = 1)
        hosts_inventory_response = RestClient::Request.execute(
          method: :get,
          url: InventorySync.inventory_export_url,
          verify_ssl: ENV['SATELLITE_INVENTORY_CLOUD_URL'] ? OpenSSL::SSL::VERIFY_NONE : OpenSSL::SSL::VERIFY_PEER,
          params: {
            per_page: 100,
            page: page
          },
          headers: {
            Authorization: "Bearer #{rh_credentials}",
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
