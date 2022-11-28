module InventorySync
  module Async
    class InventoryScheduledSync < ::Actions::EntryAction
      include ::Actions::RecurringAction
      include ForemanInventoryUpload::Async::DelayedStart

      def plan
        unless Setting[:allow_auto_inventory_upload]
          logger.debug(
            'The scheduled process is disabled due to the "allow_auto_inventory_upload"
            setting being set to false.'
          )
          return
        end

        after_delay do
          Organization.unscoped.each do |org|
            plan_org_sync(org)
          end
        end
      end

      def plan_org_sync(org)
        plan_action InventoryFullSync, org
      end

      def logger
        action_logger
      end

      def rescue_strategy_for_self
        Dynflow::Action::Rescue::Fail
      end
    end
  end
end
