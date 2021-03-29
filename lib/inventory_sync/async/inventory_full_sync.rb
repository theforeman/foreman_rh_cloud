require 'rest-client'

module InventorySync
  module Async
    class InventoryFullSync < ::Actions::EntryAction
      include ::ForemanRhCloud::CloudAuth

      def plan(organization)
        plan_self(organization_id: organization.id)
      end

      def run
        @subscribed_hosts_ids = Set.new(
          ForemanInventoryUpload::Generators::Queries.for_slice(
            Host.unscoped.where(organization_id: input[:organization_id])
          ).pluck(:id)
        )
        host_statuses = {
          sync: 0,
          disconnect: 0,
        }

        InventorySync::InventoryStatus.transaction do
          InventorySync::InventoryStatus.where(host_id: @subscribed_hosts_ids).delete_all
          page = 1
          loop do
            api_response = query_inventory(page)
            results = HostResult.new(api_response)
            logger.debug("Downloading cloud inventory data: #{results.percentage}%")
            update_hosts_status(results.status_hashes, results.touched)
            host_statuses[:sync] += results.touched.size
            page += 1
            break if results.last?
          end
          add_missing_hosts_statuses(@subscribed_hosts_ids)
          host_statuses[:disconnect] += @subscribed_hosts_ids.size
        end

        logger.debug("Synced hosts amount: #{host_statuses[:sync]}")
        logger.debug("Disconnected hosts amount: #{host_statuses[:disconnect]}")

        output[:host_statuses] = host_statuses
      end

      private

      def update_hosts_status(status_hashes, touched)
        InventorySync::InventoryStatus.create(status_hashes)
        @subscribed_hosts_ids.subtract(touched)
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
          url: ForemanInventoryUpload.inventory_export_url,
          verify_ssl: ForemanRhCloud.verify_ssl_method,
          proxy: ForemanRhCloud.transformed_http_proxy_string(logger: logger),
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

      def logger
        action_logger
      end
    end
  end
end
