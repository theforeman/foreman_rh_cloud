require 'test_plugin_helper'
require 'rest-client'

module InsightsCloud
  class UIRequestsControllerTest < ActionController::TestCase
    include KatelloCVEHelper

    setup do
      FactoryBot.create(:common_parameter, name: InsightsCloud.enable_client_param, key_type: 'boolean', value: true)
    end

    context '#forward_request' do
      include MockCerts

      setup do
        @body = 'Cloud response body'
        @http_req = RestClient::Request.new(:method => 'GET', :url => 'http://test.theforeman.org')

        @org = FactoryBot.create(:organization)
        @loc = FactoryBot.create(:location)
        host = FactoryBot.create(:host, :with_subscription, :organization => @org)
        User.current = ::Katello::CpConsumerUser.new(:uuid => host.subscription_facet.uuid, :login => host.subscription_facet.uuid)
        InsightsCloud::UIRequestsController.any_instance.stubs(:upstream_owner).returns({ 'uuid' => 'abcdefg' })
        ForemanRhCloud::TagsAuth.any_instance.stubs(:execute_cloud_request)

        setup_certs_expectation do
          ForemanRhCloud::InsightsApiForwarder.any_instance.stubs(:foreman_certificates)
        end
      end

      test "should respond with response from cloud" do
        net_http_resp = Net::HTTPResponse.new(1.0, 200, "OK")
        net_http_resp.add_field 'Set-Cookie', 'Monster'
        res = RestClient::Response.create(@body, net_http_resp, @http_req)
        ::ForemanRhCloud::InsightsApiForwarder.any_instance.stubs(:forward_request).returns(res)

        get :forward_request, params: { "controller" => "vulnerabilities", "path" => "api/vulnerability/v1/cves" }, session: set_session
        assert_equal @body, @response.body
      end

      test "should handle timeout from cloud" do
        ::ForemanRhCloud::InsightsApiForwarder.any_instance.
          stubs(:forward_request).
          raises(RestClient::Exceptions::OpenTimeout.new("Timed out connecting to server"))

        get :forward_request, params: { "controller" => "vulnerabilities", "path" => "api/vulnerability/v1/cves" }, session: set_session
        request_response = JSON.parse(@response.body)
        # I can't get @response.status to take a nil value so I'm not asserting for that

        assert_equal 'Timed out connecting to server', request_response['error']
      end

      test "should add headers to response from cloud" do
        x_resource_count = '101'
        x_rh_insights_request_id = '202'
        net_http_resp = Net::HTTPResponse.new(1.0, 200, "OK")
        net_http_resp['x_resource_count'] = x_resource_count
        net_http_resp['x_rh_insights_request_id'] = x_rh_insights_request_id
        res = RestClient::Response.create(@body, net_http_resp, @http_req)
        ::ForemanRhCloud::InsightsApiForwarder.any_instance.stubs(:forward_request).returns(res)

        get :forward_request, params: { "controller" => "vulnerabilities", "path" => "api/vulnerability/v1/cves" }, session: set_session
        assert_equal x_resource_count, @response.headers['x-resource-count']
        assert_equal x_rh_insights_request_id, @response.headers['x_rh_insights_request_id']
      end

      test "should set etag header to response from cloud" do
        etag = '12345'
        req = RestClient::Request.new(:method => 'GET', :url => 'http://test.theforeman.org', :headers => { "If-None-Match": etag })
        net_http_resp = Net::HTTPResponse.new(1.0, 200, "OK")
        net_http_resp[Rack::ETAG] = etag
        res = RestClient::Response.create(@body, net_http_resp, req)
        ::ForemanRhCloud::InsightsApiForwarder.any_instance.stubs(:forward_request).returns(res)

        get :forward_request, params: { "controller" => "vulnerabilities", "path" => "api/vulnerability/v1/cves" }, session: set_session
        assert_equal etag, @response.headers[Rack::ETAG]
      end

      test "should set content type header to response from cloud" do
        req = RestClient::Request.new(:method => 'GET', :url => 'http://test.theforeman.org')
        net_http_resp = Net::HTTPResponse.new(1.0, 200, "OK")
        net_http_resp[:content_type] = 'application/zip'
        res = RestClient::Response.create(@body, net_http_resp, req)
        ::ForemanRhCloud::InsightsApiForwarder.any_instance.stubs(:forward_request).returns(res)

        get :forward_request, params: { "controller" => "vulnerabilities", "path" => "api/vulnerability/v1/cves" }, session: set_session
        assert_equal net_http_resp[:content_type], @response.headers['Content-Type']
      end

      test "should handle StandardError" do
        error_message = "Connection refused"
        ::ForemanRhCloud::InsightsApiForwarder.any_instance.stubs(:execute_cloud_request).raises(Errno::ECONNREFUSED.new)

        get :forward_request, params: { "controller" => "vulnerabilities", "path" => "api/vulnerability/v1/cves" }, session: set_session
        assert_equal 502, @response.status
        body = JSON.parse(@response.body)
        assert_equal error_message, body['error']
      end

      test "should handle 304 cloud" do
        net_http_resp = Net::HTTPResponse.new(1.0, 304, "Not Modified")
        res = RestClient::Response.create(@body, net_http_resp, @http_req)

        ::ForemanRhCloud::InsightsApiForwarder.any_instance.stubs(:execute_cloud_request).raises(RestClient::NotModified.new(res))

        get :forward_request, params: { "controller" => "vulnerabilities", "path" => "api/vulnerability/v1/cves" }, session: set_session
        assert_equal 304, @response.status
        assert_equal 'Cloud request not modified', JSON.parse(@response.body)['message']
      end

      test "should handle RestClient::Exceptions::Timeout" do
        timeout_message = "execution expired"
        ::ForemanRhCloud::InsightsApiForwarder.any_instance.stubs(:execute_cloud_request).raises(RestClient::Exceptions::Timeout.new(timeout_message))

        get :forward_request, params: { "controller" => "vulnerabilities", "path" => "api/vulnerability/v1/cves" }, session: set_session
        assert_equal 504, @response.status
        body = JSON.parse(@response.body)
        assert_equal timeout_message, body['message']
        assert_equal timeout_message, body['error']
      end

      test "should handle failed authentication to cloud" do
        net_http_resp = Net::HTTPResponse.new(1.0, 401, "Unauthorized")
        res = RestClient::Response.create(@body, net_http_resp, @http_req)

        ::ForemanRhCloud::InsightsApiForwarder.any_instance.stubs(:execute_cloud_request).raises(RestClient::Unauthorized.new(res))

        get :forward_request, params: { "controller" => "vulnerabilities", "path" => "api/vulnerability/v1/cves" }, session: set_session
        assert_equal 401, @response.status
        assert_equal 'Authentication to the Insights Service failed.', JSON.parse(@response.body)['message']
      end

      test "should forward errors to the client" do
        net_http_resp = Net::HTTPResponse.new(1.0, 500, "TEST_RESPONSE")
        res = RestClient::Response.create(@body, net_http_resp, @http_req)
        ::ForemanRhCloud::InsightsApiForwarder.any_instance.stubs(:execute_cloud_request).raises(RestClient::InternalServerError.new(res))

        get :forward_request, params: { "controller" => "vulnerabilities", "path" => "api/vulnerability/v1/cves" }, session: set_session
        assert_equal 500, @response.status
        assert_equal 'Cloud request failed', JSON.parse(@response.body)['message']
        assert_match(/#{@body}/, JSON.parse(@response.body)['response'])
      end
    end

    def set_session
      set_session_user.merge(
        organization_id: @org.id,
        location_id: @loc.id
      )
    end
  end
end
