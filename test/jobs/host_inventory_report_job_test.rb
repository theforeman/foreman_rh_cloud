require 'test_plugin_helper'
require 'foreman_tasks/test_helpers'

class HostInventoryReportJobTest < ActiveSupport::TestCase
  include Dynflow::Testing::Factories
  include Dynflow::Testing::Assertions

  let(:organization) { FactoryBot.create(:organization) }
  let(:base_folder) { Dir.mktmpdir }
  let(:hosts_filter) { '' }
  let(:upload) { true }

  teardown do
    FileUtils.remove_entry base_folder if Dir.exist?(base_folder)
  end

  test 'plan schedules GenerateHostReport action' do
    action = create_and_plan_action(
      ForemanInventoryUpload::Async::HostInventoryReportJob,
      base_folder,
      organization.id,
      hosts_filter,
      upload
    )

    assert_action_planned_with(
      action,
      ForemanInventoryUpload::Async::GenerateHostReport,
      base_folder,
      organization.id,
      hosts_filter
    )
  end

  test 'plan schedules QueueForUploadJob when upload is true' do
    expected_archive_name = ForemanInventoryUpload.facts_archive_name(organization.id, hosts_filter)

    action = create_and_plan_action(
      ForemanInventoryUpload::Async::HostInventoryReportJob,
      base_folder,
      organization.id,
      hosts_filter,
      true
    )

    assert_action_planned_with(
      action,
      ForemanInventoryUpload::Async::QueueForUploadJob,
      base_folder,
      expected_archive_name,
      organization.id
    )
  end

  test 'plan skips QueueForUploadJob when upload is false' do
    action = create_and_plan_action(
      ForemanInventoryUpload::Async::HostInventoryReportJob,
      base_folder,
      organization.id,
      hosts_filter,
      false
    )

    refute_action_planned(action, ForemanInventoryUpload::Async::QueueForUploadJob)
  end

  test 'plan defaults upload to true when not specified' do
    action = create_and_plan_action(
      ForemanInventoryUpload::Async::HostInventoryReportJob,
      base_folder,
      organization.id,
      hosts_filter
    )

    assert_action_planned(action, ForemanInventoryUpload::Async::QueueForUploadJob)
  end

  test 'plan schedules CreateMissingInsightsFacets when IoP is enabled' do
    ForemanRhCloud.stubs(:with_iop_smart_proxy?).returns(true)

    action = create_and_plan_action(
      ForemanInventoryUpload::Async::HostInventoryReportJob,
      base_folder,
      organization.id,
      hosts_filter,
      upload
    )

    assert_action_planned_with(
      action,
      ForemanInventoryUpload::Async::CreateMissingInsightsFacets,
      organization.id
    )
  end

  test 'plan skips CreateMissingInsightsFacets when IoP is disabled' do
    ForemanRhCloud.stubs(:with_iop_smart_proxy?).returns(false)

    action = create_and_plan_action(
      ForemanInventoryUpload::Async::HostInventoryReportJob,
      base_folder,
      organization.id,
      hosts_filter,
      upload
    )

    refute_action_planned(action, ForemanInventoryUpload::Async::CreateMissingInsightsFacets)
  end

  test 'plan schedules all three actions with IoP enabled and upload true' do
    ForemanRhCloud.stubs(:with_iop_smart_proxy?).returns(true)

    action = create_and_plan_action(
      ForemanInventoryUpload::Async::HostInventoryReportJob,
      base_folder,
      organization.id,
      hosts_filter,
      true
    )

    assert_action_planned(action, ForemanInventoryUpload::Async::GenerateHostReport)
    assert_action_planned(action, ForemanInventoryUpload::Async::QueueForUploadJob)
    assert_action_planned(action, ForemanInventoryUpload::Async::CreateMissingInsightsFacets)
  end

  test 'plan schedules only generation and facets with IoP enabled and upload false' do
    ForemanRhCloud.stubs(:with_iop_smart_proxy?).returns(true)

    action = create_and_plan_action(
      ForemanInventoryUpload::Async::HostInventoryReportJob,
      base_folder,
      organization.id,
      hosts_filter,
      false
    )

    assert_action_planned(action, ForemanInventoryUpload::Async::GenerateHostReport)
    refute_action_planned(action, ForemanInventoryUpload::Async::QueueForUploadJob)
    assert_action_planned(action, ForemanInventoryUpload::Async::CreateMissingInsightsFacets)
  end

  test 'humanized_name returns correct string' do
    action = create_and_plan_action(
      ForemanInventoryUpload::Async::HostInventoryReportJob,
      base_folder,
      organization.id,
      hosts_filter,
      upload
    )

    assert_equal 'Host inventory report job', action.humanized_name
  end

  test 'handles empty hosts_filter parameter' do
    action = create_and_plan_action(
      ForemanInventoryUpload::Async::HostInventoryReportJob,
      base_folder,
      organization.id,
      '',
      upload
    )

    assert_action_planned_with(
      action,
      ForemanInventoryUpload::Async::GenerateHostReport,
      base_folder,
      organization.id,
      ''
    )
  end

  test 'handles custom hosts_filter parameter' do
    custom_filter = 'name~production'
    expected_archive_name = ForemanInventoryUpload.facts_archive_name(organization.id, custom_filter)

    action = create_and_plan_action(
      ForemanInventoryUpload::Async::HostInventoryReportJob,
      base_folder,
      organization.id,
      custom_filter,
      upload
    )

    assert_action_planned_with(
      action,
      ForemanInventoryUpload::Async::GenerateHostReport,
      base_folder,
      organization.id,
      custom_filter
    )
    assert_action_planned_with(
      action,
      ForemanInventoryUpload::Async::QueueForUploadJob,
      base_folder,
      expected_archive_name,
      organization.id
    )
  end

  test 'handles invalid hosts_filter parameter' do
    invalid_filter = 'name~~'

    action = create_and_plan_action(
      ForemanInventoryUpload::Async::HostInventoryReportJob,
      base_folder,
      organization.id,
      invalid_filter,
      upload
    )

    # Job should still plan even with invalid filter syntax
    assert_action_planned(action, ForemanInventoryUpload::Async::GenerateHostReport)
  end

  test 'handles potentially malicious hosts_filter parameter' do
    malicious_filter = "'; DROP TABLE hosts; --"

    action = create_and_plan_action(
      ForemanInventoryUpload::Async::HostInventoryReportJob,
      base_folder,
      organization.id,
      malicious_filter,
      upload
    )

    # Job should handle malicious input safely (filter is parameterized)
    assert_action_planned(action, ForemanInventoryUpload::Async::GenerateHostReport)
  end

  test 'handles non-matching hosts_filter parameter' do
    non_matching_filter = 'name~doesnotexist'

    action = create_and_plan_action(
      ForemanInventoryUpload::Async::HostInventoryReportJob,
      base_folder,
      organization.id,
      non_matching_filter,
      upload
    )

    # Job should plan successfully even if filter matches no hosts
    assert_action_planned(action, ForemanInventoryUpload::Async::GenerateHostReport)
  end
end
