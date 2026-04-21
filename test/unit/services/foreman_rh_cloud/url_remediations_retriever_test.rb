require 'test_plugin_helper'

class URLRemediationsRetrieverTest < ActiveSupport::TestCase
  test 'Calls the given url with GET when no hosts in URL' do
    retriever = ForemanRhCloud::URLRemediationsRetriever.new(
      organization_id: FactoryBot.create(:organization).id,
      url: 'http://test.example.com',
      payload: 'TEST_PAYLOAD',
      headers: {
        custom1: 'TEST_HEADER',
      }
    )

    retriever.stubs(:cert_auth_available?).returns(true)

    response = mock('response')
    response.stubs(:body).returns('TEST_RESPONSE')
    retriever.expects(:execute_cloud_request).with do |params|
      params[:method] == :get &&
      params[:url] == 'http://test.example.com' &&
      params[:headers][:custom1] == 'TEST_HEADER' &&
      params[:payload] == "\"TEST_PAYLOAD\""
    end.returns(response)

    actual = retriever.create_playbook

    assert_equal 'TEST_RESPONSE', actual
  end

  test 'Uses POST with hosts in body when URL contains hosts query param' do
    retriever = ForemanRhCloud::URLRemediationsRetriever.new(
      organization_id: FactoryBot.create(:organization).id,
      url: 'http://test.example.com/api/remediations/1234/playbook?hosts=uuid-1,uuid-2,uuid-3'
    )

    retriever.stubs(:cert_auth_available?).returns(true)

    response = mock('response')
    response.stubs(:body).returns('TEST_PLAYBOOK')
    retriever.expects(:execute_cloud_request).with do |params|
      params[:method] == :post &&
      params[:url] == 'http://test.example.com/api/remediations/1234/playbook' &&
      JSON.parse(params[:payload]) == ['uuid-1', 'uuid-2', 'uuid-3']
    end.returns(response)

    actual = retriever.create_playbook

    assert_equal 'TEST_PLAYBOOK', actual
  end

  test 'Preserves other query params when extracting hosts' do
    retriever = ForemanRhCloud::URLRemediationsRetriever.new(
      organization_id: FactoryBot.create(:organization).id,
      url: 'http://test.example.com/api/remediations/1234/playbook?hosts=uuid-1,uuid-2&localhost=false'
    )

    retriever.stubs(:cert_auth_available?).returns(true)

    response = mock('response')
    response.stubs(:body).returns('TEST_PLAYBOOK')
    retriever.expects(:execute_cloud_request).with do |params|
      params[:method] == :post &&
      params[:url].include?('localhost=false') &&
      !params[:url].include?('hosts=') &&
      JSON.parse(params[:payload]) == ['uuid-1', 'uuid-2']
    end.returns(response)

    retriever.create_playbook
  end
end
