require 'test_plugin_helper'
require 'foreman_tasks/test_helpers'

class GenerateHostReportTest < ActiveSupport::TestCase
  include Dynflow::Testing::Factories
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

    action = create_and_plan_action(
      ForemanInventoryUpload::Async::GenerateHostReport,
      base_folder,
      organization.id,
      filter
    )

    assert_equal expected_target, action.input[:target]
  end

  test 'run generates report archive' do
    expected_target = File.join(base_folder, ForemanInventoryUpload.facts_archive_name(organization.id, filter))

    ForemanInventoryUpload::Generators::ArchivedReport.expects(:new).with(expected_target).returns(@mock_generator)
    @mock_generator.expects(:render).with(organization: organization.id, filter: filter)

    action = create_and_plan_action(
      ForemanInventoryUpload::Async::GenerateHostReport,
      base_folder,
      organization.id,
      filter
    )
    action = run_action(action)

    assert_match(/Generated #{Regexp.escape(expected_target)} for organization id #{organization.id}/, action.output[:result])
  end

  test 'generates report with filter' do
    filter_value = 'id=123'
    expected_target = File.join(base_folder, ForemanInventoryUpload.facts_archive_name(organization.id, filter_value))

    ForemanInventoryUpload::Generators::ArchivedReport.expects(:new).with(expected_target).returns(@mock_generator)
    @mock_generator.expects(:render).with(organization: organization.id, filter: filter_value)

    action = create_and_plan_action(
      ForemanInventoryUpload::Async::GenerateHostReport,
      base_folder,
      organization.id,
      filter_value
    )
    action = run_action(action)

    assert_match(/organization id #{organization.id}/, action.output[:result])
  end

  test 'stores organization_id and filter in input' do
    filter_value = 'name~test'

    action = create_and_plan_action(
      ForemanInventoryUpload::Async::GenerateHostReport,
      base_folder,
      organization.id,
      filter_value
    )

    assert_equal organization.id, action.input[:organization_id]
    assert_equal filter_value, action.input[:filter]
    assert_equal base_folder, action.input[:base_folder]
  end

  test 'handles ArchivedReport generator failure' do
    expected_target = File.join(base_folder, ForemanInventoryUpload.facts_archive_name(organization.id, filter))

    ForemanInventoryUpload::Generators::ArchivedReport.expects(:new).with(expected_target).returns(@mock_generator)
    @mock_generator.expects(:render).with(organization: organization.id, filter: filter).raises(StandardError.new('Report generation failed'))

    action = create_and_plan_action(
      ForemanInventoryUpload::Async::GenerateHostReport,
      base_folder,
      organization.id,
      filter
    )

    assert_raises(StandardError) do
      run_action(action)
    end
  end
end
