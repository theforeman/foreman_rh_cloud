require 'test_plugin_helper'

class ReportsControllerTest < ActionController::TestCase
  tests InventoryUpload::ReportsController

  test 'Returns latest report generation status' do
    progress_output = mock('progress_output')
    test_portal_user = 'test_portal_user'
    InventoryUpload::Async::ProgressOutput
      .expects(:get)
      .with(InventoryUpload::Async::GenerateReportJob.output_label(test_portal_user))
      .returns(progress_output)
    progress_output.expects(:full_output).returns('test output')

    get :last, params: { portal_user: test_portal_user }, session: set_session_user

    assert_response :success
    actual = JSON.parse(response.body)
    assert_equal 'test output', actual['output']
  end
end
