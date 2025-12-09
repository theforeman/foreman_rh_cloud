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

      test 'in IoP mode host_details uses subscription uuid when insights uuid is stale' do
        ForemanRhCloud.stubs(:with_iop_smart_proxy?).returns(true)

        stale_insights_uuid = 'stale-insights-uuid-123'
        subscription_uuid   = 'subscription-uuid-456'

        # Create host with diverging facet UUIDs
        host = FactoryBot.create(:host, :with_subscription, organization: @test_org)
        host.subscription_facet.update!(uuid: subscription_uuid)
        host.insights = FactoryBot.create(:insights_facet, host_id: host.id, uuid: stale_insights_uuid)
        host.save!

        # Query using the stale insights UUID
        get :host_details, params: {
          organization_id: @test_org.id,
          host_uuids: [stale_insights_uuid],
        }

        assert_response :success
        body = JSON.parse(response.body)

        # Should return the subscription UUID, not the stale insights UUID
        insights_uuids = body.map { |h| h['insights_uuid'] }
        assert_includes insights_uuids, subscription_uuid, "Should use subscription UUID in IoP mode"
        refute_includes insights_uuids, stale_insights_uuid, "Should not use stale insights UUID"
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
