require 'test_plugin_helper'
require 'foreman_tasks/test_helpers'

class InsightsClientStatusAgingTest < ActiveSupport::TestCase
  include Dynflow::Testing::Factories

  setup do
    User.current = User.find_by(login: 'secret_admin')

    @host1 = FactoryBot.create(:host)
    @host2 = FactoryBot.create(:host)
    @host3 = FactoryBot.create(:host)
    @host4 = FactoryBot.create(:host)

    @hosts = [@host1, @host2, @host3, @host4]
  end

  test 'stale statuses should change' do
    InsightsClientReportStatus.find_or_initialize_by(host_id: @host1.id).update(status: InsightsClientReportStatus::REPORTING, reported_at: Time.now - InsightsClientReportStatus::REPORT_INTERVAL + 1.day)
    InsightsClientReportStatus.find_or_initialize_by(host_id: @host2.id).update(status: InsightsClientReportStatus::NO_REPORT, reported_at: Time.now - InsightsClientReportStatus::REPORT_INTERVAL + 1.day)
    InsightsClientReportStatus.find_or_initialize_by(host_id: @host3.id).update(status: InsightsClientReportStatus::REPORTING, reported_at: Time.now - InsightsClientReportStatus::REPORT_INTERVAL - 1.day)
    InsightsClientReportStatus.find_or_initialize_by(host_id: @host4.id).update(status: InsightsClientReportStatus::NO_REPORT, reported_at: Time.now - InsightsClientReportStatus::REPORT_INTERVAL - 1.day)

    action = create_and_plan_action(InsightsCloud::Async::InsightsClientStatusAging)
    run_action(action)

    @hosts.each(&:reload)

    assert_equal InsightsClientReportStatus::REPORTING, @host1.get_status(InsightsClientReportStatus).status
    assert_equal InsightsClientReportStatus::NO_REPORT, @host2.get_status(InsightsClientReportStatus).status
    assert_equal InsightsClientReportStatus::NO_REPORT, @host3.get_status(InsightsClientReportStatus).status
    assert_equal InsightsClientReportStatus::NO_REPORT, @host4.get_status(InsightsClientReportStatus).status
  end

  test 'aging job does not affect USER_OMITTED hosts' do
    # Host 1: USER_OMITTED with old reported_at (should stay USER_OMITTED)
    InsightsClientReportStatus.find_or_initialize_by(host_id: @host1.id).update(
      status: InsightsClientReportStatus::USER_OMITTED,
      reported_at: Time.now - InsightsClientReportStatus::REPORT_INTERVAL - 1.day
    )

    # Host 2: REPORTING with old reported_at (should change to NO_REPORT)
    InsightsClientReportStatus.find_or_initialize_by(host_id: @host2.id).update(
      status: InsightsClientReportStatus::REPORTING,
      reported_at: Time.now - InsightsClientReportStatus::REPORT_INTERVAL - 1.day
    )

    # Host 3: USER_OMITTED with recent reported_at (should stay USER_OMITTED)
    InsightsClientReportStatus.find_or_initialize_by(host_id: @host3.id).update(
      status: InsightsClientReportStatus::USER_OMITTED,
      reported_at: Time.now - 1.day
    )

    # Host 4: REPORTING with recent reported_at (should stay REPORTING)
    InsightsClientReportStatus.find_or_initialize_by(host_id: @host4.id).update(
      status: InsightsClientReportStatus::REPORTING,
      reported_at: Time.now - 1.day
    )

    action = create_and_plan_action(InsightsCloud::Async::InsightsClientStatusAging)
    run_action(action)

    @hosts.each(&:reload)

    assert_equal InsightsClientReportStatus::USER_OMITTED, @host1.get_status(InsightsClientReportStatus).status,
      'USER_OMITTED host with old report should stay USER_OMITTED'
    assert_equal InsightsClientReportStatus::NO_REPORT, @host2.get_status(InsightsClientReportStatus).status,
      'REPORTING host with old report should change to NO_REPORT'
    assert_equal InsightsClientReportStatus::USER_OMITTED, @host3.get_status(InsightsClientReportStatus).status,
      'USER_OMITTED host with recent report should stay USER_OMITTED'
    assert_equal InsightsClientReportStatus::REPORTING, @host4.get_status(InsightsClientReportStatus).status,
      'REPORTING host with recent report should stay REPORTING'
  end
end
