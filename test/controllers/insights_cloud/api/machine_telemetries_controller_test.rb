require 'test_plugin_helper'

module InsightsCloud::Api
  class MachineTelemetriesControllerTest < ActionController::TestCase
    context '#forward_request' do
      setup do
        @body = 'Cloud response body'
        @http_req = RestClient::Request.new(:method => 'GET', :url => 'http://test.theforeman.org')

        org = FactoryBot.create(:organization)
        host = FactoryBot.create(:host, :with_subscription, :organization => org)
        User.current = ::Katello::CpConsumerUser.new(:uuid => host.subscription_facet.uuid, :login => host.subscription_facet.uuid)
        InsightsCloud::Api::MachineTelemetriesController.any_instance.stubs(:upstream_owner).returns({ 'uuid' => 'abcdefg' })
      end

      test "should respond with response from cloud" do
        net_http_resp = Net::HTTPResponse.new(1.0, 200, "OK")
        net_http_resp.add_field 'Set-Cookie', 'Monster'
        res = RestClient::Response.create(@body, net_http_resp, @http_req)
        ::ForemanRhCloud::CloudRequestForwarder.any_instance.stubs(:forward_request).returns(res)

        get :forward_request, params: { "path" => "platform/module-update-router/v1/channel" }
        assert_equal @body, @response.body
      end

      test "should add headers to response from cloud" do
        x_resource_count = '101'
        x_rh_insights_request_id = '202'
        net_http_resp = Net::HTTPResponse.new(1.0, 200, "OK")
        net_http_resp['x_resource_count'] = x_resource_count
        net_http_resp['x_rh_insights_request_id'] = x_rh_insights_request_id
        res = RestClient::Response.create(@body, net_http_resp, @http_req)
        ::ForemanRhCloud::CloudRequestForwarder.any_instance.stubs(:forward_request).returns(res)

        get :forward_request, params: { "path" => "platform/module-update-router/v1/channel" }
        assert_equal x_resource_count, @response.headers['x-resource-count']
        assert_equal x_rh_insights_request_id, @response.headers['x_rh_insights_request_id']
      end

      test "should handle failed authentication to cloud" do
        net_http_resp = Net::HTTPResponse.new(1.0, 401, "Unauthorized")
        res = RestClient::Response.create(@body, net_http_resp, @http_req)
        ::ForemanRhCloud::CloudRequestForwarder.any_instance.stubs(:forward_request).returns(res)

        get :forward_request, params: { "path" => "platform/module-update-router/v1/channel" }
        assert_equal 502, @response.status
        assert_equal 'Authentication to the Insights Service failed.', JSON.parse(@response.body)['message']
      end
    end

    context '#branch_info' do
      setup do
        User.current = User.find_by(login: 'secret_admin')

        @env = FactoryBot.create(:katello_k_t_environment)
        cv = @env.content_views << FactoryBot.create(:katello_content_view, organization: @env.organization)

        @host = FactoryBot.create(
          :host,
          :with_subscription,
          :with_content,
          :with_hostgroup,
          :with_parameter,
          content_view: cv.first,
          lifecycle_environment: @env,
          organization: @env.organization
        )

        @host.subscription_facet.pools << FactoryBot.create(:katello_pool, account_number: '5678', cp_id: 1)

        uuid = @host.subscription_facet.uuid

        @user = ::Katello::CpConsumerUser.new({ :uuid => uuid, :login => uuid })

        @controller.stub(:set_client_user, @user) do
          User.current = @user
        end

        @controller.stubs(:cp_owner_id).returns('test-branch-id')
      end

      test 'should get branch info' do
        get :branch_info

        assert_response :success
      end

      test 'should handle missing organization' do
        Host::Managed.any_instance.stubs(:organization).returns(nil)
        get :branch_info

        res = JSON.parse(@response.body)
        assert_equal "Organization not found or invalid", res['message']
        assert_response 400
      end

      test 'should handle missing branch id' do
        @controller.stubs(:cp_owner_id).returns(nil)
        get :branch_info

        res = JSON.parse(@response.body)
        assert_equal "Branch ID not found for organization #{@host.organization.title}", res['message']
        assert_response 400
      end
    end
  end
end
