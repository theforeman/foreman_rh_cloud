require 'test_plugin_helper'

class UploadsControllerTest < ActionController::TestCase
  tests ForemanYupana::UploadsController

  test 'Returns latest upload status' do
    progress_output = mock('progress_output')
    ForemanYupana::Async::ProgressOutput
      .expects(:get)
      .with(ForemanYupana.uploader_output)
      .returns(progress_output)
    progress_output.expects(:full_output).returns('test output')

    get :last, session: set_session_user

    assert_response :success
    actual = JSON.parse(response.body)
    assert_equal 'test output', actual['output']
  end
end
