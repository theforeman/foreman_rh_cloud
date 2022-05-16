require 'test_plugin_helper'
require 'puma/null_io'

class CloudRequestForwarderTest < ActiveSupport::TestCase
  include MockCerts

  setup do
    @forwarder = ::ForemanRhCloud::CloudRequestForwarder.new

    ForemanRhCloud.stubs(:base_url).returns('https://cloud.example.com')
    ForemanRhCloud.stubs(:cert_base_url).returns('https://cert.cloud.example.com')
    ForemanRhCloud.stubs(:legacy_insights_url).returns('https://cert-api.access.example.com')
  end

  test 'should prepare correct cloud url' do
    paths = {
      "/redhat_access/r/insights/platform/module-update-router/v1/channel?module=insights-core" => "https://cert.cloud.example.com/api/module-update-router/v1/channel?module=insights-core",
      "/redhat_access/r/insights/v1/static/release/insights-core.egg" => "https://cert-api.access.example.com/r/insights/v1/static/release/insights-core.egg",
      "/redhat_access/r/insights/v1/static/uploader.v2.json" => "https://cert-api.access.example.com/r/insights/v1/static/uploader.v2.json",
      "/redhat_access/r/insights/v1/static/uploader.v2.json.asc" => "https://cert-api.access.example.com/r/insights/v1/static/uploader.v2.json.asc",
      "/redhat_access/r/insights/platform/inventory/v1/hosts" => "https://cert.cloud.example.com/api/inventory/v1/hosts",
      "/redhat_access/r/insights/platform/ingress/v1/upload" => "https://cert.cloud.example.com/api/ingress/v1/upload",
      "/redhat_access/r/insights/uploads/67200803-132b-474b-a6f9-37be74185df4" => "https://cert-api.access.example.com/r/insights/uploads/67200803-132b-474b-a6f9-37be74185df4",
      "/redhat_access/r/insights/" => "https://cert.cloud.example.com/api/apicast-tests/ping",
    }

    paths.each do |key, value|
      actual_params = @forwarder.path_params(key, generate_certs_hash)
      assert_equal value, actual_params[:url]
    end
  end

  test 'should forward payload from request parameters' do
    params = { 'pumpkin' => 'pie' }
    req = ActionDispatch::Request.new(
      'REQUEST_URI' => '/foo/bar',
      'REQUEST_METHOD' => 'GET',
      'rack.input' => ::Puma::NullIO.new,
      "action_dispatch.request.request_parameters" => { 'vegetables' => params }
    )
    assert_equal params, @forwarder.prepare_forward_payload(req, 'vegetables')
  end

  test 'should forward post payload' do
    post_data = 'Random POST data'
    req = ActionDispatch::Request.new(
      'REQUEST_URI' => '/foo/bar?baz=awesome',
      'REQUEST_METHOD' => 'POST',
      'rack.input' => ::Puma::NullIO.new,
      'RAW_POST_DATA' => post_data
    )
    assert_equal post_data, @forwarder.prepare_forward_payload(req, '')
  end

  test 'should forward put payload' do
    put_data = 'Random PUT data'
    req = ActionDispatch::Request.new(
      'REQUEST_URI' => '/foo/bar?baz=awesome',
      'REQUEST_METHOD' => 'PUT',
      'rack.input' => ::Puma::NullIO.new,
      'RAW_POST_DATA' => put_data
    )

    assert_equal put_data, @forwarder.prepare_forward_payload(req, '')
  end

  test 'should forward patch payload' do
    params = { 'pumpkin' => 'pie' }
    req = ActionDispatch::Request.new(
      'REQUEST_URI' => '/foo/bar?baz=awesome',
      'REQUEST_METHOD' => 'PATCH',
      'rack.input' => ::Puma::NullIO.new,
      'RAW_POST_DATA' => 'Random PATCH data',
      "action_dispatch.request.path_parameters" => { :format => "json" },
      "action_dispatch.request.request_parameters" => { 'vegetables' => params }
    )
    assert_equal params.to_json, @forwarder.prepare_forward_payload(req, 'vegetables')
  end

  test 'should forward file with metadata' do
    file_params = { :file => 'Test file', :metadata => 'File metadata' }
    req = ActionDispatch::Request.new(
      'REQUEST_URI' => '/foo/bar?baz=awesome',
      'REQUEST_METHOD' => 'POST',
      'rack.input' => ::Puma::NullIO.new,
      "action_dispatch.request.request_parameters" => file_params.merge(:foo => 'bar')
    )
    assert_equal file_params, @forwarder.prepare_forward_payload(req, '')
  end

  test 'should prepare params to forward' do
    params = { :page => 5, :per_page => 42 }
    req = ActionDispatch::Request.new(
      'REQUEST_URI' => '/foo/bar',
      'REQUEST_METHOD' => 'GET',
      'rack.input' => ::Puma::NullIO.new,
      "action_dispatch.request.query_parameters" => params
    )
    assert_equal params, @forwarder.prepare_forward_params(req, nil)
  end

  test 'should add branch id into forwarded params' do
    user_agent = { :foo => :bar }
    params = { :page => 5, :per_page => 42 }

    req = ActionDispatch::Request.new(
      'REQUEST_URI' => '/foo/bar',
      'REQUEST_METHOD' => 'GET',
      'HTTP_USER_AGENT' => user_agent,
      'rack.input' => ::Puma::NullIO.new,
      'action_dispatch.request.query_parameters' => params
    )
    assert_equal params.merge(:branch_id => 74), @forwarder.prepare_forward_params(req, 74)
  end

  test 'should reuse BranchInfo identifiers for user_agent' do
    user_agent = { :foo => :bar }
    params = { :page => 5, :per_page => 42 }
    ForemanRhCloud::BranchInfo.any_instance.expects(:core_app_name).returns('test_app')
    ForemanRhCloud::BranchInfo.any_instance.expects(:core_app_version).returns('test_ver')

    req = ActionDispatch::Request.new(
      'REQUEST_URI' => '/foo/bar',
      'REQUEST_METHOD' => 'GET',
      'HTTP_USER_AGENT' => user_agent,
      'rack.input' => ::Puma::NullIO.new,
      'action_dispatch.request.query_parameters' => params
    )

    actual = @forwarder.prepare_request_opts(req, 'TEST PAYLOAD', params, generate_certs_hash)

    assert_match /foo/, actual[:headers][:user_agent]
    assert_match /bar/, actual[:headers][:user_agent]
    assert_match /test_app/, actual[:headers][:user_agent]
    assert_match /test_ver/, actual[:headers][:user_agent]
    assert_equal 'TEST PAYLOAD', actual[:payload]
    assert_equal 'GET', actual[:method]
    assert_equal params, actual[:headers][:params]
  end

  test 'should forward content type correctly' do
    user_agent = { :foo => :bar }
    params = { :page => 5, :per_page => 42 }
    ForemanRhCloud::BranchInfo.any_instance.expects(:core_app_name).returns('test_app')
    ForemanRhCloud::BranchInfo.any_instance.expects(:core_app_version).returns('test_ver')

    req = ActionDispatch::Request.new(
      'REQUEST_URI' => '/foo/bar',
      'REQUEST_METHOD' => 'GET',
      'HTTP_USER_AGENT' => user_agent,
      'rack.input' => ::Puma::NullIO.new,
      'action_dispatch.request.query_parameters' => params
    )

    actual = @forwarder.prepare_request_opts(req, 'TEST PAYLOAD', params, generate_certs_hash)

    assert_match /text\/html/, actual[:headers][:content_type]
  end
end
