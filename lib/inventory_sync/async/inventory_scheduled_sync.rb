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
          # perform a sequence of sync then delete in parallel for all organizations
          concurrence do
            Organization.unscoped.each do |org|
              sequence do
                plan_org_sync(org)
                plan_remove_insights_hosts(org.id) if Setting[:allow_auto_insights_mismatch_delete]
              end
            end
          end
        end
      end

      def plan_org_sync(org)
        plan_action InventoryFullSync, org
      end

      def plan_remove_insights_hosts(org_id)
        # plan a remove hosts action with search set to empty (all records)
        plan_action(ForemanInventoryUpload::Async::RemoveInsightsHostsJob, '', org_id)
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
