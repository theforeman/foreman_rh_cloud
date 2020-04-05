require 'test_plugin_helper'

class AccountsControllerTest < ActionController::TestCase
  tests ForemanInventoryUpload::AccountsController

  include FolderIsolation

  test 'Returns statuses for each process type' do
    test_org = FactoryBot.create(:organization)

    generate_label = ForemanInventoryUpload::Async::GenerateReportJob.output_label(test_org.id)
    generate_output = ForemanInventoryUpload::Async::ProgressOutput.register(generate_label)
    generate_output.status = 'generate_status_test'
    upload_label = ForemanInventoryUpload::Async::UploadReportJob.output_label(test_org.id)
    upload_output = ForemanInventoryUpload::Async::ProgressOutput.register(upload_label)
    upload_output.status = 'upload_status_test'
    FactoryBot.create(:setting, :name => 'allow_auto_inventory_upload', :value => true)
    assert_equal true, Setting[:allow_auto_inventory_upload]

    get :index, session: set_session_user

    assert_response :success
    actual = JSON.parse(response.body)
    actual_account_statuses = actual['accounts'][test_org.id.to_s]
    assert_equal 'generate_status_test', actual_account_statuses['generate_report_status']
    assert_equal 'upload_status_test', actual_account_statuses['upload_report_status']

    assert_equal true, actual['autoUploadEnabled']
  end
end
