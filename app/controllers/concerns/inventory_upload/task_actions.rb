module InventoryUpload
  module TaskActions
    extend ActiveSupport::Concern

    class NothingToSyncError < Foreman::Exception
      MESSAGE = N_('Nothing to sync, there are no hosts with subscription for this organization.')

      def initialize(**params)
        super(self.class::MESSAGE, params)
      end
    end

    def start_inventory_sync(selected_org)
      subscribed_hosts = ForemanInventoryUpload::Generators::Queries.for_slice(
        Host.unscoped.where(organization: selected_org)
      )

      if subscribed_hosts.empty?
        raise NothingToSyncError
      end

      ForemanTasks.async_task(InventorySync::Async::InventoryFullSync, selected_org)
    end

  end
end