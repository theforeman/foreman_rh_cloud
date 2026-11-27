require 'test_plugin_helper'

module InsightsCloud
  class HitsControllerTest < ActionController::TestCase
    setup do
      @controller = ::InsightsCloud::HitsController.new
      @org = FactoryBot.create(:organization)
      @loc = FactoryBot.create(:location)
    end

    test 'show returns hits for the requested host' do
      host = FactoryBot.create(:host, :with_insights_hits, organization: @org, location: @loc)

      get :show, params: { host_id: host.id }, session: set_session

      assert_response :success
      body = JSON.parse(response.body)
      assert_equal 1, body['hits'].size
      assert_equal host.id, body['hits'].first['host_id']
    end

    test 'show returns not found for unknown host id' do
      get :show, params: { host_id: 0 }, session: set_session

      assert_response :not_found
      body = JSON.parse(response.body)
      assert_equal 'No recommendations were found for this host', body['error']
    end

    test 'show returns empty hits when host has no insights uuid and local hits are missing' do
      host = FactoryBot.create(:host, :managed, organization: @org, location: @loc)

      get :show, params: { host_id: host.id }, session: set_session

      assert_response :success
      body = JSON.parse(response.body)
      assert_equal [], body['hits']
    end

    test 'show falls back to cloud reports when local hits are missing' do
      host = FactoryBot.create(:host, :managed, organization: @org, location: @loc)
      host.insights = FactoryBot.create(:insights_facet, host_id: host.id, uuid: 'cloud-system-uuid')

      cloud_payload = {
        data: [
          {
            title: 'Cloud recommendation',
            total_risk: 3,
            results_url: 'https://console.redhat.com/insights/advisor/recommendations/test',
            solution_url: 'https://access.redhat.com/solutions/123',
            rule_id: 'test|RULE',
          },
        ],
      }.to_json

      ::InsightsCloud::HitsController.any_instance.expects(:execute_cloud_request).returns(cloud_payload)

      get :show, params: { host_id: host.id }, session: set_session

      assert_response :success
      body = JSON.parse(response.body)
      assert_equal 1, body['hits'].size
      assert_equal 'Cloud recommendation', body['hits'].first['title']
      assert_equal host.id, body['hits'].first['host_id']
    end

    private

    def set_session
      set_session_user.merge(
        organization_id: @org.id,
        location_id: @loc.id
      )
    end
  end
end
