require 'test_plugin_helper'

class AccountsControllerTest < ActionController::TestCase
  tests ForemanInventoryUpload::AccountsController

  include FolderIsolation

  test 'report_file_paths finds report in generated_reports folder' do
    test_org = FactoryBot.create(:organization)
    filename = ForemanInventoryUpload.facts_archive_name(test_org.id)

    generated_path = ForemanInventoryUpload.generated_reports_file_path(filename)
    FileUtils.mkdir_p(File.dirname(generated_path))
    FileUtils.touch(generated_path)

    paths = ForemanInventoryUpload.report_file_paths(test_org.id)
    assert_includes paths, generated_path
  end

  test 'report_file_paths finds report in uploads folder' do
    test_org = FactoryBot.create(:organization)
    filename = ForemanInventoryUpload.facts_archive_name(test_org.id)

    uploads_path = ForemanInventoryUpload.uploads_file_path(filename)
    FileUtils.mkdir_p(File.dirname(uploads_path))
    FileUtils.touch(uploads_path)

    paths = ForemanInventoryUpload.report_file_paths(test_org.id)
    assert_includes paths, uploads_path
  end

  test 'report_file_paths finds report in done folder' do
    test_org = FactoryBot.create(:organization)
    filename = ForemanInventoryUpload.facts_archive_name(test_org.id)

    done_path = ForemanInventoryUpload.done_file_path(filename)
    FileUtils.mkdir_p(File.dirname(done_path))
    FileUtils.touch(done_path)

    paths = ForemanInventoryUpload.report_file_paths(test_org.id)
    assert_includes paths, done_path
  end

  test 'report_file_paths returns empty when no report exists' do
    test_org = FactoryBot.create(:organization)

    paths = ForemanInventoryUpload.report_file_paths(test_org.id)
    assert_empty paths
  end

  test 'Returns statuses for each process type' do
    test_org = FactoryBot.create(:organization)

    generate_label = ForemanInventoryUpload::Async::GenerateReportJob.output_label(test_org.id)
    generate_output = ForemanInventoryUpload::Async::ProgressOutput.register(generate_label)
    generate_output.status = 'generate_status_test'
    upload_label = ForemanInventoryUpload::Async::UploadReportDirectJob.output_label(test_org.id)
    upload_output = ForemanInventoryUpload::Async::ProgressOutput.register(upload_label)
    upload_output.status = 'upload_status_test'

    get :index, session: set_session_user

    assert_response :success
    actual = JSON.parse(response.body)
    actual_account_statuses = actual['accounts'][test_org.label]
    assert_equal 'generate_status_test', actual_account_statuses['generate_report_status']
    assert_equal 'upload_status_test', actual_account_statuses['upload_report_status']
  end
end
