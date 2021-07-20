class RemoveOldInsightsStatuses < ActiveRecord::Migration[5.2]
  def up
    InsightsClientReportStatus.where(status: 2).update_all(status: InsightsClientReportStatus::NO_REPORT)
    InsightsClientReportStatus.where(status: 3).update_all(status: InsightsClientReportStatus::REPORTING)
  end
end
