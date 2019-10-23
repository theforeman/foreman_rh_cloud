require 'test_plugin_helper'

class StatusesControllerTest < ActionController::TestCase
  tests ForemanInventoryUpload::StatusesController

  include FolderIsolation

  test 'Returns statuses for each process type' do
    test_org = FactoryBot.create(:organization)

    generate_label = ForemanInventoryUpload::Async::GenerateReportJob.output_label(test_org.id)
    generate_output = ForemanInventoryUpload::Async::ProgressOutput.register(generate_label)
    generate_output.status = 'generate_status_test'
    upload_label = ForemanInventoryUpload::Async::UploadReportJob.output_label(test_org.id)
    upload_output = ForemanInventoryUpload::Async::ProgressOutput.register(upload_label)
    upload_output.status = 'upload_status_test'

    get :index, session: set_session_user

    assert_response :success
    actual = JSON.parse(response.body)['statuses'][test_org.name]
    assert_equal 'generate_status_test', actual['generate_report_status']
    assert_equal 'upload_status_test', actual['upload_report_status']
  end
end
