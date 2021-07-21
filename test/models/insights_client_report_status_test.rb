require 'test_plugin_helper'

class InsightsClientReportStatusTest < ActiveSupport::TestCase
  setup do
    @host = FactoryBot.create(:host, :managed)
  end

  test 'fresh host does not have insights status' do
    @host.reload

    refute @host.host_statuses.where(type: 'InsightsClientReportStatus').exists?
    insights_status = @host.get_status(InsightsClientReportStatus)
    refute insights_status.relevant?
  end

  test 'host can refresh all its statuses' do
    @host.refresh_statuses
    @host.reload

    refute @host.host_statuses.where(type: 'InsightsClientReportStatus').exists?
  end

  test 'host with correct report status sets global status to OK' do
    global_status = @host.get_status(HostStatus.find_status_by_humanized_name('Global'))
    # Status has to be OK before action
    assert_equal HostStatus::Global::OK, global_status.status

    # force create record
    @host.get_status(InsightsClientReportStatus).refresh!
    # now refresh should work
    @host.refresh_statuses([InsightsClientReportStatus])

    @host.reload
    global_status = @host.get_status(HostStatus.find_status_by_humanized_name('Global'))
    # Status has to be OK after the action too
    assert_equal HostStatus::Global::OK, global_status.status

    insights_status = @host.get_status(InsightsClientReportStatus)
    # assert the status would be displayed
    assert insights_status.relevant?
  end

  test 'host will return to OK once the status is refreshed' do
    global_status = @host.get_status(HostStatus.find_status_by_humanized_name('Global'))
    # Status has to be OK before action
    assert_equal HostStatus::Global::OK, global_status.status

    insights_status = @host.get_status(InsightsClientReportStatus)
    insights_status.status = InsightsClientReportStatus::NO_REPORT
    insights_status.save!
    @host.refresh_global_status!
    global_status = @host.global_status
    assert_equal HostStatus::Global::ERROR, global_status

    @host.refresh_statuses([InsightsClientReportStatus])

    @host.reload
    # Status has to be OK after the action too
    assert_equal HostStatus::Global::OK, @host.global_status
  end

  test 'host with stale status would set global to ERROR' do
    global_status = @host.get_status(HostStatus.find_status_by_humanized_name('Global'))
    # Status has to be OK before action
    assert_equal HostStatus::Global::OK, global_status.status

    insights_status = @host.get_status(InsightsClientReportStatus)
    insights_status.status = InsightsClientReportStatus::NO_REPORT
    insights_status.save!
    @host.refresh_global_status!
    @host.reload

    assert_equal HostStatus::Global::ERROR, @host.global_status
  end
end
