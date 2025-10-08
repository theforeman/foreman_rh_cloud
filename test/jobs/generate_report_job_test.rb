require 'test_plugin_helper'
require 'foreman_tasks/test_helpers'

class GenerateReportJobTest < ActiveSupport::TestCase
  include Dynflow::Testing::Factories
  include Dynflow::Testing::Assertions

  let(:organization) { FactoryBot.create(:organization) }
  let(:base_folder) { Dir.mktmpdir }

  setup do
    # Stub settings
    Setting.stubs(:[]).with(:subscription_connection_enabled).returns(true)
    Setting.stubs(:[]).with("foreman_tasks_sync_task_timeout").returns(120)
    Setting.stubs(:[]).with(:content_default_http_proxy).returns(nil)
    Setting.stubs(:[]).with(:http_proxy).returns(nil)
  end

  teardown do
    FileUtils.remove_entry base_folder if Dir.exist?(base_folder)
  end

  test 'disconnected parameter defaults to false' do
    # When disconnected defaults to false and subscription_connection is enabled,
    # QueueForUploadJob should be scheduled
    action = create_and_plan_action(
      ForemanInventoryUpload::Async::GenerateReportJob,
      base_folder,
      organization.id
    )

    assert_action_planed(action, ForemanInventoryUpload::Async::QueueForUploadJob)
  end

  test 'disconnected parameter can be set to true explicitly' do
    # When disconnected is explicitly true, QueueForUploadJob should NOT be scheduled
    action = create_and_plan_action(
      ForemanInventoryUpload::Async::GenerateReportJob,
      base_folder,
      organization.id,
      true
    )

    refute_action_planed(action, ForemanInventoryUpload::Async::QueueForUploadJob)
  end

  test 'disconnected parameter can be set to false explicitly' do
    # When disconnected is explicitly false and subscription_connection is enabled,
    # QueueForUploadJob should be scheduled
    action = create_and_plan_action(
      ForemanInventoryUpload::Async::GenerateReportJob,
      base_folder,
      organization.id,
      false
    )

    assert_action_planed(action, ForemanInventoryUpload::Async::QueueForUploadJob)
  end

  test 'skips upload when subscription_connection_enabled is false' do
    Setting.stubs(:[]).with(:subscription_connection_enabled).returns(false)

    action = create_and_plan_action(
      ForemanInventoryUpload::Async::GenerateReportJob,
      base_folder,
      organization.id,
      false
    )

    refute_action_planed(action, ForemanInventoryUpload::Async::QueueForUploadJob)
  end

  test 'schedules upload when disconnected is false and subscription_connection is enabled' do
    Setting.stubs(:[]).with(:subscription_connection_enabled).returns(true)

    expected_archive_name = ForemanInventoryUpload.facts_archive_name(organization.id, nil)
    action = create_and_plan_action(
      ForemanInventoryUpload::Async::GenerateReportJob,
      base_folder,
      organization.id,
      false
    )

    assert_action_planed_with(
      action,
      ForemanInventoryUpload::Async::QueueForUploadJob,
      base_folder,
      expected_archive_name,
      organization.id
    )
  end

  test 'handles hosts_filter parameter' do
    hosts_filter = 'name~test'
    expected_archive_name = ForemanInventoryUpload.facts_archive_name(organization.id, hosts_filter)

    action = create_and_plan_action(
      ForemanInventoryUpload::Async::GenerateReportJob,
      base_folder,
      organization.id,
      false,
      hosts_filter
    )

    assert_action_planed_with(
      action,
      ForemanInventoryUpload::Async::QueueForUploadJob,
      base_folder,
      expected_archive_name,
      organization.id
    )
  end

  test 'output_label generates correct label' do
    label = ForemanInventoryUpload::Async::GenerateReportJob.output_label('test_org')
    assert_equal 'report_for_test_org', label
  end

  test 'output_label with filter includes parameterized filter' do
    action = create_and_plan_action(
      ForemanInventoryUpload::Async::GenerateReportJob,
      base_folder,
      organization.id,
      false,
      'name~production'
    )

    # The output label should include organization id and parameterized filter
    expected_label = "report_for_#{organization.id}[name-production]"
    assert_equal expected_label, action.input[:instance_label]
  end

  test 'output_label without filter includes only organization id' do
    action = create_and_plan_action(
      ForemanInventoryUpload::Async::GenerateReportJob,
      base_folder,
      organization.id,
      false,
      ''
    )

    # The output label should include only organization id when filter is empty
    expected_label = "report_for_#{organization.id}"
    assert_equal expected_label, action.input[:instance_label]
  end
end
