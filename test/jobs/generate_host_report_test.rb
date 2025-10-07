require 'test_plugin_helper'
require 'foreman_tasks/test_helpers'

class GenerateHostReportTest < ActiveSupport::TestCase
  include ForemanTasks::TestHelpers::WithInThreadExecutor
  include FolderIsolation

  let(:organization) { FactoryBot.create(:organization) }
  let(:base_folder) { @tmpdir }
  let(:filter) { '' }

  setup do
    # Stub the ArchivedReport generator
    @mock_generator = mock('archived_report_generator')
    @mock_generator.stubs(:render)
    ForemanInventoryUpload::Generators::ArchivedReport.stubs(:new).returns(@mock_generator)
  end

  test 'plan sets target path correctly' do
    expected_archive_name = ForemanInventoryUpload.facts_archive_name(organization.id, filter)
    expected_target = File.join(base_folder, expected_archive_name)

    task = ForemanTasks.sync_task(
      ForemanInventoryUpload::Async::GenerateHostReport,
      base_folder,
      organization.id,
      filter
    )

    assert_equal expected_target, task.input[:target]
  end

  test 'run generates report archive' do
    expected_target = File.join(base_folder, ForemanInventoryUpload.facts_archive_name(organization.id, filter))

    ForemanInventoryUpload::Generators::ArchivedReport.expects(:new).with(expected_target).returns(@mock_generator)
    @mock_generator.expects(:render).with(organization: organization.id, filter: filter)

    task = ForemanTasks.sync_task(
      ForemanInventoryUpload::Async::GenerateHostReport,
      base_folder,
      organization.id,
      filter
    )

    assert_equal 'success', task.result
    assert_match(/Generated #{Regexp.escape(expected_target)} for organization id #{organization.id}/, task.output[:result])
  end

  test 'generates report with filter' do
    filter_value = 'id=123'
    expected_target = File.join(base_folder, ForemanInventoryUpload.facts_archive_name(organization.id, filter_value))

    ForemanInventoryUpload::Generators::ArchivedReport.expects(:new).with(expected_target).returns(@mock_generator)
    @mock_generator.expects(:render).with(organization: organization.id, filter: filter_value)

    task = ForemanTasks.sync_task(
      ForemanInventoryUpload::Async::GenerateHostReport,
      base_folder,
      organization.id,
      filter_value
    )

    assert_equal 'success', task.result
    assert_match(/organization id #{organization.id}/, task.output[:result])
  end

  test 'stores organization_id and filter in input' do
    filter_value = 'name~test'

    task = ForemanTasks.sync_task(
      ForemanInventoryUpload::Async::GenerateHostReport,
      base_folder,
      organization.id,
      filter_value
    )

    assert_equal organization.id, task.input[:organization_id]
    assert_equal filter_value, task.input[:filter]
    assert_equal base_folder, task.input[:base_folder]
  end

  test 'handles ArchivedReport generator failure' do
    expected_target = File.join(base_folder, ForemanInventoryUpload.facts_archive_name(organization.id, filter))

    ForemanInventoryUpload::Generators::ArchivedReport.expects(:new).with(expected_target).returns(@mock_generator)
    @mock_generator.expects(:render).with(organization: organization.id, filter: filter).raises(StandardError.new('Report generation failed'))

    assert_raises(StandardError) do
      ForemanTasks.sync_task(
        ForemanInventoryUpload::Async::GenerateHostReport,
        base_folder,
        organization.id,
        filter
      )
    end
  end
end
