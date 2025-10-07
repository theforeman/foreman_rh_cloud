require 'test_plugin_helper'
require 'foreman_tasks/test_helpers'

class HostInventoryReportJobTest < ActiveSupport::TestCase
  include ForemanTasks::TestHelpers::WithInThreadExecutor
  include FolderIsolation

  let(:organization) { FactoryBot.create(:organization) }
  let(:base_folder) { @tmpdir }
  let(:hosts_filter) { '' }
  let(:upload) { true }

  setup do
    # Stub the sub-actions to isolate the orchestration logic
    ForemanInventoryUpload::Async::GenerateHostReport.any_instance.stubs(:run)
    ForemanInventoryUpload::Async::QueueForUploadJob.any_instance.stubs(:run)
    ForemanInventoryUpload::Async::QueueForUploadJob.any_instance.stubs(:plan_upload_report)
    ForemanInventoryUpload::Async::CreateMissingInsightsFacets.any_instance.stubs(:run)
  end

  test 'plan schedules GenerateHostReport action' do
    ForemanInventoryUpload::Async::GenerateHostReport.any_instance.expects(:plan).with(
      base_folder,
      organization.id,
      hosts_filter
    )

    ForemanTasks.sync_task(
      ForemanInventoryUpload::Async::HostInventoryReportJob,
      base_folder,
      organization.id,
      hosts_filter,
      upload
    )
  end

  test 'plan schedules QueueForUploadJob when upload is true' do
    expected_archive_name = ForemanInventoryUpload.facts_archive_name(organization.id, hosts_filter)

    ForemanInventoryUpload::Async::QueueForUploadJob.any_instance.expects(:plan).with(
      base_folder,
      expected_archive_name,
      organization.id
    )

    ForemanTasks.sync_task(
      ForemanInventoryUpload::Async::HostInventoryReportJob,
      base_folder,
      organization.id,
      hosts_filter,
      true
    )
  end

  test 'plan skips QueueForUploadJob when upload is false' do
    ForemanInventoryUpload::Async::QueueForUploadJob.any_instance.expects(:plan).never

    ForemanTasks.sync_task(
      ForemanInventoryUpload::Async::HostInventoryReportJob,
      base_folder,
      organization.id,
      hosts_filter,
      false
    )
  end

  test 'plan defaults upload to true when not specified' do
    ForemanInventoryUpload::Async::QueueForUploadJob.any_instance.expects(:plan).once

    ForemanTasks.sync_task(
      ForemanInventoryUpload::Async::HostInventoryReportJob,
      base_folder,
      organization.id,
      hosts_filter
    )
  end

  test 'plan schedules CreateMissingInsightsFacets when IoP is enabled' do
    ForemanRhCloud.stubs(:with_iop_smart_proxy?).returns(true)

    ForemanInventoryUpload::Async::CreateMissingInsightsFacets.any_instance.expects(:plan).with(
      organization.id
    )

    ForemanTasks.sync_task(
      ForemanInventoryUpload::Async::HostInventoryReportJob,
      base_folder,
      organization.id,
      hosts_filter,
      upload
    )
  end

  test 'plan skips CreateMissingInsightsFacets when IoP is disabled' do
    ForemanRhCloud.stubs(:with_iop_smart_proxy?).returns(false)

    ForemanInventoryUpload::Async::CreateMissingInsightsFacets.any_instance.expects(:plan).never

    ForemanTasks.sync_task(
      ForemanInventoryUpload::Async::HostInventoryReportJob,
      base_folder,
      organization.id,
      hosts_filter,
      upload
    )
  end

  test 'plan schedules all three actions with IoP enabled and upload true' do
    ForemanRhCloud.stubs(:with_iop_smart_proxy?).returns(true)

    ForemanInventoryUpload::Async::GenerateHostReport.any_instance.expects(:plan).once
    ForemanInventoryUpload::Async::QueueForUploadJob.any_instance.expects(:plan).once
    ForemanInventoryUpload::Async::CreateMissingInsightsFacets.any_instance.expects(:plan).once

    ForemanTasks.sync_task(
      ForemanInventoryUpload::Async::HostInventoryReportJob,
      base_folder,
      organization.id,
      hosts_filter,
      true
    )
  end

  test 'plan schedules only generation and facets with IoP enabled and upload false' do
    ForemanRhCloud.stubs(:with_iop_smart_proxy?).returns(true)

    ForemanInventoryUpload::Async::GenerateHostReport.any_instance.expects(:plan).once
    ForemanInventoryUpload::Async::QueueForUploadJob.any_instance.expects(:plan).never
    ForemanInventoryUpload::Async::CreateMissingInsightsFacets.any_instance.expects(:plan).once

    ForemanTasks.sync_task(
      ForemanInventoryUpload::Async::HostInventoryReportJob,
      base_folder,
      organization.id,
      hosts_filter,
      false
    )
  end

  test 'humanized_name returns correct string' do
    task = ForemanTasks.sync_task(
      ForemanInventoryUpload::Async::HostInventoryReportJob,
      base_folder,
      organization.id,
      hosts_filter,
      upload
    )

    # Access the action through the task's execution plan
    action = task.main_action
    assert_equal 'Host inventory report job', action.humanized_name
  end

  test 'handles empty hosts_filter parameter' do
    ForemanInventoryUpload::Async::GenerateHostReport.any_instance.expects(:plan).with(
      base_folder,
      organization.id,
      ''
    )

    ForemanTasks.sync_task(
      ForemanInventoryUpload::Async::HostInventoryReportJob,
      base_folder,
      organization.id,
      '',
      upload
    )
  end

  test 'handles custom hosts_filter parameter' do
    custom_filter = 'name~production'
    expected_archive_name = ForemanInventoryUpload.facts_archive_name(organization.id, custom_filter)

    ForemanInventoryUpload::Async::GenerateHostReport.any_instance.expects(:plan).with(
      base_folder,
      organization.id,
      custom_filter
    )

    ForemanInventoryUpload::Async::QueueForUploadJob.any_instance.expects(:plan).with(
      base_folder,
      expected_archive_name,
      organization.id
    )

    ForemanTasks.sync_task(
      ForemanInventoryUpload::Async::HostInventoryReportJob,
      base_folder,
      organization.id,
      custom_filter,
      upload
    )
  end
end
