require 'test_plugin_helper'

class ReportsControllerTest < ActionController::TestCase
  tests ForemanInventoryUpload::ReportsController

  test 'Returns latest report generation status' do
    progress_output = mock('progress_output')
    test_org = FactoryBot.create(:organization)
    ForemanInventoryUpload::Async::ProgressOutput
      .expects(:get)
      .with(ForemanInventoryUpload::Async::GenerateReportJob.output_label(test_org.id))
      .returns(progress_output)
    progress_output.expects(:full_output).returns('test output')

    get :last, params: { organization_id: test_org.id }, session: set_session_user

    assert_response :success
    actual = JSON.parse(response.body)
    assert_equal 'test output', actual['output']
  end
end
