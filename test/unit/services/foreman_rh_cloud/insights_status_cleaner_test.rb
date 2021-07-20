require 'test_plugin_helper'

class InsightsStatusCleanerTest < ActiveSupport::TestCase
  setup do
    @host1 = FactoryBot.create(:host)
    @host2 = FactoryBot.create(:host)

    InsightsClientReportStatus.find_or_initialize_by(host_id: @host1.id).update(status: InsightsClientReportStatus::NO_REPORT, reported_at: Time.now - InsightsClientReportStatus::REPORT_INTERVAL + 1.day)
    InsightsClientReportStatus.find_or_initialize_by(host_id: @host2.id).update(status: InsightsClientReportStatus::NO_REPORT, reported_at: Time.now - InsightsClientReportStatus::REPORT_INTERVAL + 1.day)

    @host1.refresh_global_status!
    @host2.refresh_global_status!
  end

  test 'Cleans hosts by search condition' do
    assert_equal HostStatus::Global::ERROR, @host1.global_status
    assert_equal HostStatus::Global::ERROR, @host2.global_status

    instance = ForemanRhCloud::InsightsStatusCleaner.new
    actual_count = instance.clean("name = #{@host1.name}")

    @host1.reload
    @host2.refresh_global_status!

    assert_equal 1, actual_count
    assert_equal HostStatus::Global::OK, @host1.global_status
    assert_equal HostStatus::Global::ERROR, @host2.global_status
    assert InsightsClientReportStatus.where(host_id: @host1.id).empty?
    refute InsightsClientReportStatus.where(host_id: @host2.id).empty?
  end
end
