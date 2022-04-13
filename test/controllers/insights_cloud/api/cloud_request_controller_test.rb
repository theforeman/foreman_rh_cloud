require 'json'
require 'test_plugin_helper'

module InsightsCloud::Api
  class CloudRequestControllerTest < ActionController::TestCase
    tests Api::V2::RhCloud::CloudRequestController

    setup do
      @test_org = FactoryBot.create(:organization)
    end

    test 'Fails for unknown directives' do
      request_params = run_playbook_request
      request_params['directive'] = 'not-valid'

      post :update, params: request_params

      assert_response :bad_request
    end

    test 'Starts playbook run for correct directive' do
      Setting[:rh_cloud_token] = 'MOCK_TOKEN'
      host1 = FactoryBot.create(:host, :with_insights_hits)
      host1.insights.uuid = 'TEST_UUID1'
      host1.insights.save!
      host2 = FactoryBot.create(:host, :with_insights_hits)
      host2.insights.uuid = 'TEST_UUID2'
      host2.insights.save!

      mock_composer = mock('composer')
      ::JobInvocationComposer.expects(:for_feature).with do |feature, host_ids, params|
        feature == :rh_cloud_connector_run_playbook &&
        host_ids.first == host1.id &&
        host_ids.last == host2.id
      end.returns(mock_composer)
      mock_composer.expects(:trigger!)
      mock_composer.expects(:job_invocation)

      post :update, params: run_playbook_request

      assert_response :success
    end

    private

    def run_playbook_request
      request_json = <<-REQUEST
      {
        "type": "data",
        "message_id": "a6a7d866-7de0-409a-84e0-3c56c4171bb7",
        "version": 1,
        "sent": "2021-01-12T15:30:08+00:00",
        "directive": "playbook-sat",
        "metadata": {
            "operation": "run",
            "return_url": "https://cloud.redhat.com/api/v1/ingres/upload",
            "correlation_id": "6684b9dd-0d16-42c1-b13a-9f45be59e3b6",
            "playbook_run_name": "Human-readable playbook run name",
            "playbook_run_url": "https://console.redhat.com/insights/remediations/1234",
            "sat_id": "aa3b1faa-56f3-4d14-8258-615d11e20060",
            "sat_org_id": "#{FactoryBot.create(:organization).id}",
            "initiator_user_id": "4efca34c6d9ae05ef7c3d7a7424e6370d198159a841ae005084888a9a4529e27",
            "hosts": "TEST_UUID1,TEST_UUID2",
            "response_interval": "30",
            "response_full": "false"
        },
        "content": ""
      }
      REQUEST

      request = JSON.parse(request_json)

      request['content'] = "\"#{Base64.encode64('https://cloud.redhat.com/api/v1/remediations/1234/playbook')}\""

      request
    end
  end
end
