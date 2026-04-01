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

  test 'host with host_registration_insights parameter set to false gets USER_OMITTED status' do
    @host.host_parameters << HostParameter.create(
      name: 'host_registration_insights',
      value: 'false',
      parameter_type: 'boolean'
    )
    @host.save!

    insights_status = @host.get_status(InsightsClientReportStatus)
    insights_status.refresh!

    assert_equal InsightsClientReportStatus::USER_OMITTED, insights_status.status
    assert_equal HostStatus::Global::OK, insights_status.to_global
  end

  test 'USER_OMITTED status has correct label' do
    insights_status = @host.get_status(InsightsClientReportStatus)
    insights_status.status = InsightsClientReportStatus::USER_OMITTED
    insights_status.save!

    label = insights_status.to_label
    assert_match(/host_registration_insights/, label)
    assert_match(/false/, label)
  end

  test 'stale scope excludes USER_OMITTED hosts' do
    host1 = FactoryBot.create(:host, :managed)
    host2 = FactoryBot.create(:host, :managed)
    host3 = FactoryBot.create(:host, :managed)

    # Host 1: USER_OMITTED with old reported_at (should NOT be in stale scope)
    status1 = host1.get_status(InsightsClientReportStatus)
    status1.status = InsightsClientReportStatus::USER_OMITTED
    status1.reported_at = Time.zone.now - InsightsClientReportStatus::REPORT_INTERVAL - 1.day
    status1.save!

    # Host 2: REPORTING with old reported_at (should be in stale scope)
    status2 = host2.get_status(InsightsClientReportStatus)
    status2.status = InsightsClientReportStatus::REPORTING
    status2.reported_at = Time.zone.now - InsightsClientReportStatus::REPORT_INTERVAL - 1.day
    status2.save!

    # Host 3: NO_REPORT with old reported_at (should be in stale scope)
    status3 = host3.get_status(InsightsClientReportStatus)
    status3.status = InsightsClientReportStatus::NO_REPORT
    status3.reported_at = Time.zone.now - InsightsClientReportStatus::REPORT_INTERVAL - 1.day
    status3.save!

    stale_statuses = InsightsClientReportStatus.stale
    stale_host_ids = stale_statuses.pluck(:host_id)

    assert_not_includes stale_host_ids, host1.id, 'USER_OMITTED host should not be in stale scope'
    assert_includes stale_host_ids, host2.id, 'REPORTING host with old report should be in stale scope'
    assert_includes stale_host_ids, host3.id, 'NO_REPORT host with old report should be in stale scope'
  end

  test 'USER_OMITTED status respects parameter inheritance from hostgroup' do
    # Create a hostgroup with parameter = false
    hostgroup = FactoryBot.create(:hostgroup)
    hostgroup.group_parameters << GroupParameter.create(
      name: 'host_registration_insights',
      value: 'false',
      key_type: 'boolean'
    )
    hostgroup.save!

    @host.hostgroup = hostgroup
    @host.save!

    # Verify parameter is inherited (not set directly on host)
    assert_nil @host.parameters.find_by(name: 'host_registration_insights'),
      'Test setup: parameter should not be set directly on host'

    insights_status = @host.get_status(InsightsClientReportStatus)
    insights_status.refresh!

    assert_equal InsightsClientReportStatus::USER_OMITTED, insights_status.status,
      'Status should be USER_OMITTED when host_registration_insights=false is inherited from hostgroup'
    assert_equal HostStatus::Global::OK, insights_status.to_global,
      'USER_OMITTED status should not affect global status'
  end

  test 'host parameter overrides inherited parameter from hostgroup' do
    # Create a hostgroup with parameter = false
    hostgroup = FactoryBot.create(:hostgroup)
    hostgroup.group_parameters << GroupParameter.create(
      name: 'host_registration_insights',
      value: 'false',
      key_type: 'boolean'
    )
    hostgroup.save!

    @host.hostgroup = hostgroup

    # Override with host parameter = true
    @host.host_parameters << HostParameter.create(
      name: 'host_registration_insights',
      value: 'true',
      parameter_type: 'boolean'
    )
    @host.save!

    insights_status = @host.get_status(InsightsClientReportStatus)
    insights_status.refresh!

    assert_not_equal InsightsClientReportStatus::USER_OMITTED, insights_status.status,
      'Status should not be USER_OMITTED when host parameter overrides hostgroup parameter with true'
  end
end
