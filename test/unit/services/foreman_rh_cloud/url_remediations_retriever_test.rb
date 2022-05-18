require 'test_plugin_helper'

class UrlRemediationsRetrieverTest < ActiveSupport::TestCase
  test 'Calls the given url' do
    retreiver = ForemanRhCloud::UrlRemediationsRetriever.new(
      organization_id: FactoryBot.create(:organization).id,
      url: 'http://test.example.com',
      payload: 'TEST_PAYLOAD',
      headers: {
        custom1: 'TEST_HEADER',
      }
    )

    retreiver.stubs(:cert_auth_available?).returns(true)

    response = mock('response')
    response.stubs(:body).returns('TEST_RESPONSE')
    retreiver.expects(:execute_cloud_request).with do |params|
      params[:method] == :get &&
      params[:url] == 'http://test.example.com' &&
      params[:headers][:custom1] == 'TEST_HEADER' &&
      params[:payload] == "\"TEST_PAYLOAD\""
    end.returns(response)

    actual = retreiver.create_playbook

    assert_equal 'TEST_RESPONSE', actual
  end
end
