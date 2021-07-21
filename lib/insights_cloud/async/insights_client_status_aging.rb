module InsightsCloud
  module Async
    class InsightsClientStatusAging < ::Actions::EntryAction
      include ::Actions::RecurringAction

      def run
        host_ids = InsightsClientReportStatus.stale.reporting.pluck(:host_id)

        # update all stale records
        InsightsClientReportStatus.where(host_id: host_ids).update_all(status: InsightsClientReportStatus::NO_REPORT)

        # refresh global status
        Host.where(id: host_ids).preload(:host_statuses).find_in_batches do |hosts|
          hosts.each { |host| host.refresh_global_status! }
        end
      end

      def logger
        action_logger
      end
    end
  end
end
