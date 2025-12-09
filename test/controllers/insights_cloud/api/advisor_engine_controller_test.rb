require 'test_plugin_helper'

module InsightsCloud
  module Api
    class AdvisorEngineControllerTest < ActionController::TestCase
      tests ::Api::V2::AdvisorEngine::AdvisorEngineController

      setup do
        @test_org = FactoryBot.create(:organization)
        @host1 = FactoryBot.create(:host, :with_insights_hits, organization: @test_org, hostname: 'insightshost1')
        @host2 = FactoryBot.create(:host, :with_insights_hits, organization: @test_org, hostname: 'insightshost2')
        @host3 = FactoryBot.create(:host, organization: @test_org)
      end

      test 'shows hosts with uuids' do
        uuids = [@host1.insights_uuid, @host2.insights_uuid]
        get :host_details, params: { organization_id: @test_org.id, host_uuids: uuids }
        assert_response :success
        assert_template 'api/v2/advisor_engine/host_details'
        assert_equal @test_org.hosts.joins(:insights).where(:insights => { :uuid => uuids }).count, assigns(:hosts).count
        refute_equal @test_org.hosts.count, assigns(:hosts).count
      end

      test 'shows error when no hosts found' do
        get :host_details, params: { organization_id: @test_org.id, host_uuids: ['nonexistentuuid'] }
        assert_response :not_found
        assert_equal 'No hosts found for the given UUIDs', JSON.parse(response.body)['error']
      end

      test 'test upload hits with payload' do
        uuid = SecureRandom.uuid
        payload = { "data": "dummy data" }
        ForemanRhCloud::HitsUploader.any_instance.expects(:upload!).returns
        patch :upload_hits, params: { host_name: @host1.name, host_uuid: uuid, payload: payload }
        assert_response :ok
        assert_equal 'success', JSON.parse(response.body)['action_status']
      end

      test 'test upload hits with bad host' do
        uuid = SecureRandom.uuid
        payload = { "data": "dummy data" }
        patch :upload_hits, params: { host_name: "NO SUCH HOST", host_uuid: uuid, payload: payload }
        assert_response :not_found
        assert_equal 'No host found for the given host name', JSON.parse(response.body)['error']
      end
    end
  end
end
