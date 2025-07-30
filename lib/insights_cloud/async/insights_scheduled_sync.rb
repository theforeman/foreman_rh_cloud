module InsightsCloud
  module Async
    class InsightsScheduledSync < ::Actions::EntryAction
      include ::Actions::RecurringAction
      include ForemanInventoryUpload::Async::DelayedStart

      def plan
        unless Setting[:allow_auto_insights_sync]
          logger.debug(
            'The scheduled process is disabled due to the "allow_auto_insights_sync"
            setting being set to false.'
          )
          return
        end

        if ForemanRhCloud.with_iop_smart_proxy?
          plan_self
        else
          after_delay do
            plan_full_sync # so that 'run' runs
          end
        end
      end

      def run
        output[:status] = _('The scheduled process is disabled because this Foreman is configured with a local IoP Smart Proxy.') if ForemanRhCloud.with_iop_smart_proxy?
      end

      def plan_full_sync
        plan_action(InsightsFullSync, Organization.unscoped.all)
      end

      def rescue_strategy_for_self
        Dynflow::Action::Rescue::Fail
      end

      def logger
        action_logger
      end
    end
  end
end
