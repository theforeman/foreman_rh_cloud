require 'test_plugin_helper'

module RedhatAccess
  class MachineTelemetriesControllerTest < ActionController::TestCase

    setup do
      @body = 'Cloud response body'
      @http_req = RestClient::Request.new(:method => 'GET', :url => 'http://test.theforeman.org')

      org = FactoryBot.create(:organization)
      host = FactoryBot.create(:host, :with_subscription, :organization => org)
      User.current = ::Katello::CpConsumerUser.new(:uuid => host.subscription_facet.uuid, :login => host.subscription_facet.uuid)
      RedhatAccess::MachineTelemetriesController.any_instance.stubs(:upstream_owner).returns({ 'uuid' => 'abcdefg' })
    end

    test "should respond with response from cloud" do
      net_http_resp = Net::HTTPResponse.new(1.0, 200, "OK")
      net_http_resp.add_field 'Set-Cookie', 'Monster'
      res = RestClient::Response.create(@body, net_http_resp, @http_req)
      ::ForemanRhCloud::CloudRequestForwarder.any_instance.stubs(:forward_request).returns(res)

      get :forward_request, params: { "path"=>"platform/module-update-router/v1/channel" }
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

      get :forward_request, params: { "path"=>"platform/module-update-router/v1/channel" }
      assert_equal x_resource_count, @response.headers['x-resource-count']
      assert_equal x_rh_insights_request_id, @response.headers['x_rh_insights_request_id']
    end

    test "should handle failed authentication to cloud" do
      net_http_resp = Net::HTTPResponse.new(1.0, 401, "Unauthorized")
      res = RestClient::Response.create(@body, net_http_resp, @http_req)
      ::ForemanRhCloud::CloudRequestForwarder.any_instance.stubs(:forward_request).returns(res)

      get :forward_request, params: { "path"=>"platform/module-update-router/v1/channel" }
      assert_equal 502, @response.status
      assert_equal 'Authentication to the Insights Service failed.', JSON.parse(@response.body)['message']
    end
  end
end

