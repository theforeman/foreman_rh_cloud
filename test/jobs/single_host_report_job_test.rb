require 'test_plugin_helper'
require 'foreman_tasks/test_helpers'

class SingleHostReportJobTest < ActiveSupport::TestCase
  include ForemanTasks::TestHelpers::WithInThreadExecutor
  include FolderIsolation
  include KatelloCVEHelper
  include JobActionStubbing

  let(:base_folder) { @tmpdir }

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

    # Stub the sub-actions to isolate the orchestration logic
    stub_inventory_report_job_actions
  end

  test 'plan sets host_id in input' do
    task = ForemanTasks.sync_task(
      ForemanInventoryUpload::Async::SingleHostReportJob,
      base_folder,
      @host.organization_id,
      @host.id
    )

    assert_equal @host.id, task.input[:host_id]
  end

  test 'plan calls super with id filter' do
    expected_filter = "id=#{@host.id}"

    ForemanInventoryUpload::Async::GenerateHostReport.any_instance.expects(:plan).with(
      base_folder,
      @host.organization_id,
      expected_filter
    )

    ForemanTasks.sync_task(
      ForemanInventoryUpload::Async::SingleHostReportJob,
      base_folder,
      @host.organization_id,
      @host.id
    )
  end

  test 'inherits behavior from HostInventoryReportJob' do
    # Should schedule all parent actions
    ForemanInventoryUpload::Async::GenerateHostReport.any_instance.expects(:plan).once
    ForemanInventoryUpload::Async::QueueForUploadJob.any_instance.expects(:plan).once

    ForemanTasks.sync_task(
      ForemanInventoryUpload::Async::SingleHostReportJob,
      base_folder,
      @host.organization_id,
      @host.id
    )
  end

  test 'humanized_name includes hostname' do
    task = ForemanTasks.sync_task(
      ForemanInventoryUpload::Async::SingleHostReportJob,
      base_folder,
      @host.organization_id,
      @host.id
    )

    action = task.main_action
    assert_equal "Single-host report job for host #{@host.name}", action.humanized_name
  end

  test 'humanized_name handles missing host' do
    non_existent_host_id = 999999

    task = ForemanTasks.sync_task(
      ForemanInventoryUpload::Async::SingleHostReportJob,
      base_folder,
      @host.organization_id,
      non_existent_host_id
    )

    action = task.main_action
    assert_equal 'Single-host report job', action.humanized_name
  end

  test 'hostname method returns correct name' do
    task = ForemanTasks.sync_task(
      ForemanInventoryUpload::Async::SingleHostReportJob,
      base_folder,
      @host.organization_id,
      @host.id
    )

    action = task.main_action
    assert_equal @host.name, action.hostname(@host.id)
  end

  test 'hostname method handles nil gracefully' do
    task = ForemanTasks.sync_task(
      ForemanInventoryUpload::Async::SingleHostReportJob,
      base_folder,
      @host.organization_id,
      @host.id
    )

    action = task.main_action
    assert_nil action.hostname(999999)
  end

  test 'generates report with correct archive name for single host' do
    expected_filter = "id=#{@host.id}"
    expected_archive_name = ForemanInventoryUpload.facts_archive_name(@host.organization_id, expected_filter)

    ForemanInventoryUpload::Async::QueueForUploadJob.any_instance.expects(:plan).with(
      base_folder,
      expected_archive_name,
      @host.organization_id
    )

    ForemanTasks.sync_task(
      ForemanInventoryUpload::Async::SingleHostReportJob,
      base_folder,
      @host.organization_id,
      @host.id
    )
  end

  test 'respects IoP mode for facet creation' do
    ForemanRhCloud.stubs(:with_iop_smart_proxy?).returns(true)

    ForemanInventoryUpload::Async::CreateMissingInsightsFacets.any_instance.expects(:plan).with(
      @host.organization_id
    )

    ForemanTasks.sync_task(
      ForemanInventoryUpload::Async::SingleHostReportJob,
      base_folder,
      @host.organization_id,
      @host.id
    )
  end
end
