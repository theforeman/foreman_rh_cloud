module InventorySync
  module Async
    class InventoryScheduledSync < ::Actions::EntryAction
      include ::Actions::RecurringAction

      def plan
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
