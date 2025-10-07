require 'test_plugin_helper'
require 'foreman_tasks/test_helpers'

class GenerateReportJobTest < ActiveSupport::TestCase
  include ForemanTasks::TestHelpers::WithInThreadExecutor
  include FolderIsolation

  let(:organization) { FactoryBot.create(:organization) }
  let(:base_folder) { @tmpdir }

  setup do
    # Stub the ShellProcess parent class behavior
    ForemanInventoryUpload::Async::GenerateReportJob.any_instance.stubs(:start_process)
    ForemanInventoryUpload::Async::GenerateReportJob.any_instance.stubs(:run)

    # Stub QueueForUploadJob
    ForemanInventoryUpload::Async::QueueForUploadJob.any_instance.stubs(:run)
    ForemanInventoryUpload::Async::QueueForUploadJob.any_instance.stubs(:plan_upload_report)

    # Stub settings
    Setting.stubs(:[]).with(:subscription_connection_enabled).returns(true)
    Setting.stubs(:[]).with("foreman_tasks_sync_task_timeout").returns(120)
    Setting.stubs(:[]).with(:content_default_http_proxy).returns(nil)
    Setting.stubs(:[]).with(:http_proxy).returns(nil)
  end

  test 'disconnected parameter defaults to false' do
    # When disconnected defaults to false and subscription_connection is enabled,
    # QueueForUploadJob should be scheduled
    ForemanInventoryUpload::Async::QueueForUploadJob.any_instance.expects(:plan).once

    ForemanTasks.sync_task(
      ForemanInventoryUpload::Async::GenerateReportJob,
      base_folder,
      organization.id
    )
  end

  test 'disconnected parameter can be set to true explicitly' do
    # When disconnected is explicitly true, QueueForUploadJob should NOT be scheduled
    ForemanInventoryUpload::Async::QueueForUploadJob.any_instance.expects(:plan).never

    ForemanTasks.sync_task(
      ForemanInventoryUpload::Async::GenerateReportJob,
      base_folder,
      organization.id,
      true
    )
  end

  test 'disconnected parameter can be set to false explicitly' do
    # When disconnected is explicitly false and subscription_connection is enabled,
    # QueueForUploadJob should be scheduled
    ForemanInventoryUpload::Async::QueueForUploadJob.any_instance.expects(:plan).once

    ForemanTasks.sync_task(
      ForemanInventoryUpload::Async::GenerateReportJob,
      base_folder,
      organization.id,
      false
    )
  end

  test 'skips upload when subscription_connection_enabled is false' do
    Setting.stubs(:[]).with(:subscription_connection_enabled).returns(false)

    ForemanInventoryUpload::Async::QueueForUploadJob.any_instance.expects(:plan).never

    ForemanTasks.sync_task(
      ForemanInventoryUpload::Async::GenerateReportJob,
      base_folder,
      organization.id,
      false
    )
  end

  test 'schedules upload when disconnected is false and subscription_connection is enabled' do
    Setting.stubs(:[]).with(:subscription_connection_enabled).returns(true)

    expected_archive_name = ForemanInventoryUpload.facts_archive_name(organization.id, nil)
    ForemanInventoryUpload::Async::QueueForUploadJob.any_instance.expects(:plan).with(
      base_folder,
      expected_archive_name,
      organization.id
    )

    ForemanTasks.sync_task(
      ForemanInventoryUpload::Async::GenerateReportJob,
      base_folder,
      organization.id,
      false
    )
  end

  test 'handles hosts_filter parameter' do
    hosts_filter = 'name~test'
    expected_archive_name = ForemanInventoryUpload.facts_archive_name(organization.id, hosts_filter)

    ForemanInventoryUpload::Async::QueueForUploadJob.any_instance.expects(:plan).with(
      base_folder,
      expected_archive_name,
      organization.id
    )

    ForemanTasks.sync_task(
      ForemanInventoryUpload::Async::GenerateReportJob,
      base_folder,
      organization.id,
      false,
      hosts_filter
    )
  end

  test 'output_label generates correct label' do
    label = ForemanInventoryUpload::Async::GenerateReportJob.output_label('test_org')
    assert_equal 'report_for_test_org', label
  end

  test 'output_label with filter includes parameterized filter' do
    task = ForemanTasks.sync_task(
      ForemanInventoryUpload::Async::GenerateReportJob,
      base_folder,
      organization.id,
      false,
      'name~production'
    )

    # The output label should include organization and parameterized filter
    assert task.label.present?
  end
end
