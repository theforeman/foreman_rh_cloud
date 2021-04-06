module InsightsCloud
  module Async
    class InsightsScheduledSync < ::ApplicationJob
      def perform
        unless Setting[:allow_auto_insights_sync]
          logger.debug(
            'The scheduled process is disabled due to the "allow_auto_insights_sync"
            setting being set to false.'
          )
          return
        end

        ForemanTasks.async_task InsightsFullSync
      ensure
        self.class.set(:wait => 24.hours).perform_later
      end

      def self.singleton_job_name
        name
      end
    end
  end
end
