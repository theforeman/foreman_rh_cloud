require 'test_plugin_helper'
require 'puma/null_io'

class CloudRequestForwarderTest < ActiveSupport::TestCase
  setup do
    @forwarder = ::ForemanRhCloud::CloudRequestForwarder.new
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
end
