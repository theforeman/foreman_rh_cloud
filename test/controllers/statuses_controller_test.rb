require 'test_plugin_helper'

class StatusesControllerTest < ActionController::TestCase
  tests InventoryUpload::StatusesController

  include FolderIsolation

  test 'Returns statuses for each process type' do
    configuration = RedhatAccess::TelemetryConfiguration.new(enable_telemetry: true, portal_user: 'test')
    configuration.save!

    generate_label = InventoryUpload::Async::GenerateReportJob.output_label('test')
    generate_output = InventoryUpload::Async::ProgressOutput.register(generate_label)
    generate_output.status = 'generate_status_test'
    upload_label = InventoryUpload::Async::UploadReportJob.output_label('test')
    upload_output = InventoryUpload::Async::ProgressOutput.register(upload_label)
    upload_output.status = 'upload_status_test'

    get :index, session: set_session_user

    assert_response :success
    actual = JSON.parse(response.body)['statuses']['test']
    assert_equal 'generate_status_test', actual['generate_report_status']
    assert_equal 'upload_status_test', actual['upload_report_status']
  end
end
