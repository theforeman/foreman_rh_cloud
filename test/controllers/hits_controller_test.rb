require 'test_plugin_helper'

class HitsControllerTest < ActionController::TestCase
  tests InsightsCloud::HitsController

  test 'Returns latest upload status' do

    post :remediate, params: { remediations: {} }, session: set_session_user

    assert_response :success
    actual = JSON.parse(response.body)
    assert_equal 'test output', actual['output']
  end
end
