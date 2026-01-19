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
    # Ensure stubs are cleaned up to avoid leakage into other tests
    ForemanRhCloud.unstub(:with_iop_smart_proxy?)
  end

  test 'plan schedules GenerateHostReport action' do
    action = create_action(ForemanInventoryUpload::Async::HostInventoryReportJob)
    action.expects(:action_subject).with(organization)
    plan_action(action, base_folder, organization.id, hosts_filter, upload)

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

    action = create_action(ForemanInventoryUpload::Async::HostInventoryReportJob)
    action.expects(:action_subject).with(organization)
    plan_action(action, base_folder, organization.id, hosts_filter, true)

    assert_action_planned_with(
      action,
      ForemanInventoryUpload::Async::QueueForUploadJob,
      base_folder,
      expected_archive_name,
      organization.id
    )
  end

  test 'plan skips QueueForUploadJob when upload is false' do
    action = create_action(ForemanInventoryUpload::Async::HostInventoryReportJob)
    action.expects(:action_subject).with(organization)
    plan_action(action, base_folder, organization.id, hosts_filter, false)

    refute_action_planned(action, ForemanInventoryUpload::Async::QueueForUploadJob)
  end

  test 'plan defaults upload to true when not specified' do
    action = create_action(ForemanInventoryUpload::Async::HostInventoryReportJob)
    action.expects(:action_subject).with(organization)
    plan_action(action, base_folder, organization.id, hosts_filter)

    assert_action_planned(action, ForemanInventoryUpload::Async::QueueForUploadJob)
  end

  test 'plan schedules CreateMissingInsightsFacets when IoP is enabled' do
    ForemanRhCloud.stubs(:with_iop_smart_proxy?).returns(true)

    action = create_action(ForemanInventoryUpload::Async::HostInventoryReportJob)
    action.expects(:action_subject).with(organization)
    plan_action(action, base_folder, organization.id, hosts_filter, upload)

    assert_action_planned_with(
      action,
      ForemanInventoryUpload::Async::CreateMissingInsightsFacets,
      organization.id
    )
  end

  test 'plan skips CreateMissingInsightsFacets when IoP is disabled' do
    ForemanRhCloud.stubs(:with_iop_smart_proxy?).returns(false)

    action = create_action(ForemanInventoryUpload::Async::HostInventoryReportJob)
    action.expects(:action_subject).with(organization)
    plan_action(action, base_folder, organization.id, hosts_filter, upload)

    refute_action_planned(action, ForemanInventoryUpload::Async::CreateMissingInsightsFacets)
  end

  test 'plan schedules all three actions with IoP enabled and upload true' do
    ForemanRhCloud.stubs(:with_iop_smart_proxy?).returns(true)

    action = create_action(ForemanInventoryUpload::Async::HostInventoryReportJob)
    action.expects(:action_subject).with(organization)
    plan_action(action, base_folder, organization.id, hosts_filter, true)

    assert_action_planned(action, ForemanInventoryUpload::Async::GenerateHostReport)
    assert_action_planned(action, ForemanInventoryUpload::Async::QueueForUploadJob)
    assert_action_planned(action, ForemanInventoryUpload::Async::CreateMissingInsightsFacets)
  end

  test 'plan schedules only generation and facets with IoP enabled and upload false' do
    ForemanRhCloud.stubs(:with_iop_smart_proxy?).returns(true)

    action = create_action(ForemanInventoryUpload::Async::HostInventoryReportJob)
    action.expects(:action_subject).with(organization)
    plan_action(action, base_folder, organization.id, hosts_filter, false)

    assert_action_planned(action, ForemanInventoryUpload::Async::GenerateHostReport)
    refute_action_planned(action, ForemanInventoryUpload::Async::QueueForUploadJob)
    assert_action_planned(action, ForemanInventoryUpload::Async::CreateMissingInsightsFacets)
  end

  test 'humanized_name returns correct string' do
    action = create_action(ForemanInventoryUpload::Async::HostInventoryReportJob)
    action.expects(:action_subject).with(organization)
    plan_action(action, base_folder, organization.id, hosts_filter, upload)

    assert_equal 'Host inventory report job', action.humanized_name
  end

  test 'handles empty hosts_filter parameter' do
    action = create_action(ForemanInventoryUpload::Async::HostInventoryReportJob)
    action.expects(:action_subject).with(organization)
    plan_action(action, base_folder, organization.id, '', upload)

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

    action = create_action(ForemanInventoryUpload::Async::HostInventoryReportJob)
    action.expects(:action_subject).with(organization)
    plan_action(action, base_folder, organization.id, custom_filter, upload)

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

    action = create_action(ForemanInventoryUpload::Async::HostInventoryReportJob)
    action.expects(:action_subject).with(organization)
    plan_action(action, base_folder, organization.id, invalid_filter, upload)

    # Job should still plan even with invalid filter syntax
    assert_action_planned(action, ForemanInventoryUpload::Async::GenerateHostReport)
  end

  test 'handles potentially malicious hosts_filter parameter' do
    malicious_filter = "'; DROP TABLE hosts; --"

    action = create_action(ForemanInventoryUpload::Async::HostInventoryReportJob)
    action.expects(:action_subject).with(organization)
    plan_action(action, base_folder, organization.id, malicious_filter, upload)

    # Job should handle malicious input safely (filter is parameterized)
    assert_action_planned(action, ForemanInventoryUpload::Async::GenerateHostReport)
  end

  test 'handles non-matching hosts_filter parameter' do
    non_matching_filter = 'name~doesnotexist'

    action = create_action(ForemanInventoryUpload::Async::HostInventoryReportJob)
    action.expects(:action_subject).with(organization)
    plan_action(action, base_folder, organization.id, non_matching_filter, upload)

    # Job should plan successfully even if filter matches no hosts
    assert_action_planned(action, ForemanInventoryUpload::Async::GenerateHostReport)
  end

  test 'organization returns correct Organization from input' do
    action = create_action(ForemanInventoryUpload::Async::HostInventoryReportJob)
    action.expects(:action_subject).with(organization)
    plan_action(action, base_folder, organization.id, hosts_filter, upload)

    assert_equal organization.id, action.organization.id
    assert_instance_of Organization, action.organization
  end

  test 'resource_locks returns :link' do
    action = create_action(ForemanInventoryUpload::Async::HostInventoryReportJob)

    assert_equal :link, action.resource_locks
  end

  test 'report_file_path returns nil when no file exists' do
    action = create_action(ForemanInventoryUpload::Async::HostInventoryReportJob)
    action.expects(:action_subject).with(organization)
    plan_action(action, base_folder, organization.id, hosts_filter, true)

    assert_nil action.report_file_path
  end

  test 'report_file_path finds file in done folder for upload tasks' do
    filename = ForemanInventoryUpload.facts_archive_name(organization.id, hosts_filter)
    done_path = ForemanInventoryUpload.done_file_path(filename)

    # Create the done file
    FileUtils.mkdir_p(File.dirname(done_path))
    FileUtils.touch(done_path)

    action = create_action(ForemanInventoryUpload::Async::HostInventoryReportJob)
    action.expects(:action_subject).with(organization)
    plan_action(action, base_folder, organization.id, hosts_filter, true)

    assert_equal done_path, action.report_file_path

    # Cleanup
    FileUtils.rm_f(done_path)
  end

  test 'report_file_path finds file in uploads folder for upload tasks' do
    filename = ForemanInventoryUpload.facts_archive_name(organization.id, hosts_filter)
    uploads_path = ForemanInventoryUpload.uploads_file_path(filename)

    # Create the uploads file
    FileUtils.mkdir_p(File.dirname(uploads_path))
    FileUtils.touch(uploads_path)

    action = create_action(ForemanInventoryUpload::Async::HostInventoryReportJob)
    action.expects(:action_subject).with(organization)
    plan_action(action, base_folder, organization.id, hosts_filter, true)

    assert_equal uploads_path, action.report_file_path

    # Cleanup
    FileUtils.rm_f(uploads_path)
  end

  test 'report_file_path finds file in generated_reports folder for upload tasks' do
    filename = ForemanInventoryUpload.facts_archive_name(organization.id, hosts_filter)
    generated_path = File.join(base_folder, filename)

    # Create the generated file
    FileUtils.mkdir_p(base_folder)
    FileUtils.touch(generated_path)

    action = create_action(ForemanInventoryUpload::Async::HostInventoryReportJob)
    action.expects(:action_subject).with(organization)
    plan_action(action, base_folder, organization.id, hosts_filter, true)

    assert_equal generated_path, action.report_file_path
  end

  test 'report_file_path only checks generated_reports folder for non-upload tasks' do
    filename = ForemanInventoryUpload.facts_archive_name(organization.id, hosts_filter)
    generated_path = File.join(base_folder, filename)
    done_path = ForemanInventoryUpload.done_file_path(filename)

    # Create files in both locations
    FileUtils.mkdir_p(base_folder)
    FileUtils.touch(generated_path)
    FileUtils.mkdir_p(File.dirname(done_path))
    FileUtils.touch(done_path)

    action = create_action(ForemanInventoryUpload::Async::HostInventoryReportJob)
    action.expects(:action_subject).with(organization)
    plan_action(action, base_folder, organization.id, hosts_filter, false)

    # Should return the generated_path, not the done_path (since upload=false)
    assert_equal generated_path, action.report_file_path

    # Cleanup
    FileUtils.rm_f(done_path)
  end

  test 'report_file_path prioritizes done folder over uploads folder' do
    filename = ForemanInventoryUpload.facts_archive_name(organization.id, hosts_filter)
    done_path = ForemanInventoryUpload.done_file_path(filename)
    uploads_path = ForemanInventoryUpload.uploads_file_path(filename)

    # Create files in both locations
    FileUtils.mkdir_p(File.dirname(done_path))
    FileUtils.touch(done_path)
    FileUtils.mkdir_p(File.dirname(uploads_path))
    FileUtils.touch(uploads_path)

    action = create_action(ForemanInventoryUpload::Async::HostInventoryReportJob)
    action.expects(:action_subject).with(organization)
    plan_action(action, base_folder, organization.id, hosts_filter, true)

    # Should prefer done_path (uploaded) over uploads_path (queued)
    assert_equal done_path, action.report_file_path

    # Cleanup
    FileUtils.rm_f(done_path)
    FileUtils.rm_f(uploads_path)
  end
end
