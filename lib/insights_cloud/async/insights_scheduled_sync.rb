module InsightsCloud
  module Async
    class InsightsScheduledSync < ::Actions::EntryAction
      include ::Actions::RecurringAction

      def plan
        unless Setting[:allow_auto_insights_sync]
          logger.debug(
            'The scheduled process is disabled due to the "allow_auto_insights_sync"
            setting being set to false.'
          )
          return
        end

        plan_full_sync
      end

      def plan_full_sync
        plan_action InsightsFullSync
      end

      def rescue_strategy_for_self
        Dynflow::Action::Rescue::Fail
      end
    end
  end
end
