require 'test_plugin_helper'
require 'foreman_tasks/test_helpers'

class SingleHostReportJobTest < ActiveSupport::TestCase
  include Dynflow::Testing::Factories
  include Dynflow::Testing::Assertions
  include KatelloCVEHelper

  let(:base_folder) { Dir.mktmpdir }

  setup do
    User.current = User.find_by(login: 'secret_admin')
    cve = make_cve
    env = cve.lifecycle_environment

    @host = FactoryBot.create(
      :host,
      :with_subscription,
      :with_content,
      content_view: cve.content_view,
      lifecycle_environment: env,
      organization: env.organization
    )
  end

  teardown do
    FileUtils.remove_entry base_folder if Dir.exist?(base_folder)
  end

  test 'plan sets host_id in input' do
    action = create_and_plan_action(
      ForemanInventoryUpload::Async::SingleHostReportJob,
      base_folder,
      @host.organization_id,
      @host.id
    )

    assert_equal @host.id, action.input[:host_id]
  end

  test 'plan calls super with id filter' do
    expected_filter = "id=#{@host.id}"

    action = create_and_plan_action(
      ForemanInventoryUpload::Async::SingleHostReportJob,
      base_folder,
      @host.organization_id,
      @host.id
    )

    assert_action_planned_with(
      action,
      ForemanInventoryUpload::Async::GenerateHostReport,
      base_folder,
      @host.organization_id,
      expected_filter
    )
  end

  test 'inherits behavior from HostInventoryReportJob' do
    action = create_and_plan_action(
      ForemanInventoryUpload::Async::SingleHostReportJob,
      base_folder,
      @host.organization_id,
      @host.id
    )

    # Should schedule all parent actions
    assert_action_planned(action, ForemanInventoryUpload::Async::GenerateHostReport)
    assert_action_planned(action, ForemanInventoryUpload::Async::QueueForUploadJob)
  end

  test 'humanized_name includes hostname' do
    action = create_and_plan_action(
      ForemanInventoryUpload::Async::SingleHostReportJob,
      base_folder,
      @host.organization_id,
      @host.id
    )

    assert_equal "Single-host report job for host #{@host.name}", action.humanized_name
  end

  test 'humanized_name handles missing host' do
    non_existent_host_id = 999_999

    action = create_and_plan_action(
      ForemanInventoryUpload::Async::SingleHostReportJob,
      base_folder,
      @host.organization_id,
      non_existent_host_id
    )

    assert_equal 'Single-host report job', action.humanized_name
  end

  test 'hostname method returns correct name' do
    action = create_and_plan_action(
      ForemanInventoryUpload::Async::SingleHostReportJob,
      base_folder,
      @host.organization_id,
      @host.id
    )

    assert_equal @host.name, action.hostname(@host.id)
  end

  test 'hostname method handles nil gracefully' do
    action = create_and_plan_action(
      ForemanInventoryUpload::Async::SingleHostReportJob,
      base_folder,
      @host.organization_id,
      @host.id
    )

    assert_nil action.hostname(999_999)
  end

  test 'generates report with correct archive name for single host' do
    expected_filter = "id=#{@host.id}"
    expected_archive_name = ForemanInventoryUpload.facts_archive_name(@host.organization_id, expected_filter)

    action = create_and_plan_action(
      ForemanInventoryUpload::Async::SingleHostReportJob,
      base_folder,
      @host.organization_id,
      @host.id
    )

    assert_action_planned_with(
      action,
      ForemanInventoryUpload::Async::QueueForUploadJob,
      base_folder,
      expected_archive_name,
      @host.organization_id
    )
  end

  test 'respects IoP mode for facet creation' do
    ForemanRhCloud.stubs(:with_iop_smart_proxy?).returns(true)

    action = create_and_plan_action(
      ForemanInventoryUpload::Async::SingleHostReportJob,
      base_folder,
      @host.organization_id,
      @host.id
    )

    assert_action_planned_with(
      action,
      ForemanInventoryUpload::Async::CreateMissingInsightsFacets,
      @host.organization_id
    )
  end
end
