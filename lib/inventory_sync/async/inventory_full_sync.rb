module InventorySync
  module Async
    class InventoryFullSync < InventoryHostsSync
      set_callback :iteration, :around, :setup_statuses
      set_callback :step, :around, :update_statuses_batch

      def plan(organization)
        unless cloud_auth_available?
          logger.debug('Cloud authentication is not available, skipping inventory hosts sync')
          return
        end

        plan_self(organization_id: organization.id)
      end

      def setup_statuses
        @subscribed_hosts_ids = Set.new(affected_host_ids)

        InventorySync::InventoryStatus.transaction do
          InventorySync::InventoryStatus.where(host_id: @subscribed_hosts_ids).delete_all
          yield
          add_missing_hosts_statuses(@subscribed_hosts_ids)
          host_statuses[:disconnect] += @subscribed_hosts_ids.size
        end

        logger.debug("Synced hosts amount: #{host_statuses[:sync]}")
        logger.debug("Disconnected hosts amount: #{host_statuses[:disconnect]}")
        output[:host_statuses] = host_statuses
      end

      def update_statuses_batch
        results = yield

        existing_hosts = results.status_hashes.select { |hash| @subscribed_hosts_ids.include?(hash[:host_id]) }

        update_hosts_status(existing_hosts)
        host_statuses[:sync] += existing_hosts.size
      end

      private

      def update_hosts_status(status_hashes)
        InventorySync::InventoryStatus.create(status_hashes)
        updated_ids = status_hashes.map { |hash| hash[:host_id] }
        @subscribed_hosts_ids.subtract(updated_ids)
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

      def host_statuses
        @host_statuses ||= {
          sync: 0,
          disconnect: 0,
        }
      end

      def affected_host_ids
        ForemanInventoryUpload::Generators::Queries.for_slice(
          Host.unscoped.where(organization: input[:organization_id])
        ).pluck(:id)
      end
    end
  end
end
