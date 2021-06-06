module InventorySync
  module Async
    class InventoryScheduledSync < ::Actions::EntryAction
      include ::Actions::RecurringAction

      def plan
        unless Setting[:allow_auto_inventory_upload]
          logger.debug(
            'The scheduled process is disabled due to the "allow_auto_inventory_upload"
            setting being set to false.'
          )
          return
        end

        Organization.unscoped.each do |org|
          plan_org_sync(org)
        end
      end

      def plan_org_sync(org)
        plan_action InventoryFullSync, org
      end
    end
  end
end
