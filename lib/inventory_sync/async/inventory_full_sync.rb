module InventorySync
  module Async
    class InventoryFullSync < InventoryHostsSync
      set_callback :iteration, :around, :setup_statuses
      set_callback :step, :around, :update_statuses_batch

      def plan(organization)
        unless cert_auth_available?(organization)
          logger.debug('Cloud authentication is not available, skipping inventory hosts sync')
          return
        end

        super(organization)
      end

      def setup_statuses
        @subscribed_hosts_ids = Set.new(affected_host_ids)
        @omitted_ids = Set.new(user_omitted_host_ids)

        # Remove user-omitted hosts from subscribed set. In normal operation, affected_host_ids
        # already excludes user-omitted hosts via for_slice, but this handles edge cases like
        # a host transitioning from uploaded to user-omitted between syncs.
        @subscribed_hosts_ids.subtract(@omitted_ids)

        InventorySync::InventoryStatus.transaction do
          InventorySync::InventoryStatus.where(host_id: @subscribed_hosts_ids).delete_all
          yield
          add_missing_hosts_statuses(@subscribed_hosts_ids) # any remaining hosts after yield are disconnected
          add_user_omitted_host_statuses(@omitted_ids)
          host_statuses[:disconnect] += @subscribed_hosts_ids.size
          host_statuses[:user_omitted] += @omitted_ids.size
        end

        logger.debug("Synced hosts count: #{host_statuses[:sync]}")
        logger.debug("Disconnected hosts count: #{host_statuses[:disconnect]}")
        logger.debug("User-omitted hosts count: #{host_statuses[:user_omitted]}")
        output[:host_statuses] = host_statuses
      end

      def update_statuses_batch
        results = yield

        existing_hosts = results.status_hashes.select { |hash| @subscribed_hosts_ids.include?(hash[:host_id]) }

        update_hosts_status(existing_hosts)
        host_statuses[:sync] += existing_hosts.size
      end

      def rescue_strategy_for_self
        Dynflow::Action::Rescue::Fail
      end

      private

      def update_hosts_status(status_hashes)
        # create Inventory statuses
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

      def add_user_omitted_host_statuses(host_ids)
        InventorySync::InventoryStatus.create(
          host_ids.map do |host_id|
            {
              host_id: host_id,
              status: InventorySync::InventoryStatus::USER_OMITTED,
              reported_at: DateTime.current,
            }
          end
        )
      end

      def host_statuses
        @host_statuses ||= {
          sync: 0,
          disconnect: 0,
          user_omitted: 0,
        }
      end

      def affected_host_ids
        ForemanInventoryUpload::Generators::Queries.for_slice(
          Host.unscoped.where(organization: organizations)
        ).pluck(:id)
      end

      def user_omitted_host_ids
        param_name = InsightsCloud.enable_client_param_inventory

        # Load parameters (not hosts) and filter using Foreman::Cast.to_bool
        Parameter.where(
          name: param_name,
          reference_id: Host.unscoped.where(organization: organizations).select(:id),
          type: 'HostParameter'
        ).select { |param| ::Foreman::Cast.to_bool(param.value) == false }.map(&:reference_id)
      end
    end
  end
end
