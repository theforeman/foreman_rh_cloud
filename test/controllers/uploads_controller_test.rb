require 'test_plugin_helper'

class UploadsControllerTest < ActionController::TestCase
  tests ForemanYupana::UploadsController

  test 'Returns latest upload status' do
    progress_output = mock('progress_output')
    test_portal_user = 'test_portal_user'
    ForemanYupana::Async::ProgressOutput
      .expects(:get)
      .with(ForemanYupana::Async::UploadReportJob.output_label(test_portal_user))
      .returns(progress_output)
    progress_output.expects(:full_output).returns('test output')

    get :last, params: { portal_user: test_portal_user }, session: set_session_user

    assert_response :success
    actual = JSON.parse(response.body)
    assert_equal 'test output', actual['output']
  end
end
