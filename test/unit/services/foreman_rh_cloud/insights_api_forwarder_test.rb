require 'test_plugin_helper'
require 'puma/null_io'

class UIRequestForwarderTest < ActiveSupport::TestCase
  include MockCerts

  setup do
    @forwarder = ::ForemanRhCloud::InsightsApiForwarder.new
    @user = FactoryBot.build(:user)
    @organization = FactoryBot.build(:organization)
    @location = FactoryBot.build(:location)

    setup_certs_expectation do
      @forwarder.stubs(:foreman_certificates)
    end

    ForemanRhCloud.stubs(:cert_base_url).returns('https://cert.cloud.example.com')
  end

  test 'should scope GET requests with proper tags' do
    user_agent = { :foo => :bar }
    params = {}

    req = ActionDispatch::Request.new(
      'REQUEST_URI' => '/api/vulnerability/v1/cves/abc-123/affected_systems',
      'REQUEST_METHOD' => 'GET',
      'HTTP_USER_AGENT' => user_agent,
      'rack.input' => ::Puma::NullIO.new,
      'action_dispatch.request.query_parameters' => params
    )

    ::ForemanRhCloud::TagsAuth.any_instance.expects(:update_tag)
    @forwarder.expects(:execute_cloud_request).with do |actual_params|
      actual = actual_params[:headers][:params]
      assert_equal "U:\"#{@user.login}\"O:\"#{@organization.name}\"L:\"#{@location.name}\"", tag_value(actual.find { |param| param[0] == :tag && tag_name(param[1]) =~ /#{ForemanRhCloud::TagsAuth::TAG_NAME}/ }[1])
      true
    end

    @forwarder.forward_request(req, '/api/vulnerability/v1/cves/abc-123/affected_systems', 'test_controller', @user, @organization, @location)

    # This test asserts the parameters that are sent to the execute_cloud_request method.
    # This is done by setting the expectation before the actual call.
  end

  test 'should not scope GET requests for unknown uris' do
    user_agent = { :foo => :bar }
    params = {}

    req = ActionDispatch::Request.new(
      'REQUEST_URI' => '/api/vulnerability/foo/bar',
      'REQUEST_METHOD' => 'GET',
      'HTTP_USER_AGENT' => user_agent,
      'rack.input' => ::Puma::NullIO.new,
      'action_dispatch.request.query_parameters' => params
    )

    ::ForemanRhCloud::TagsAuth.any_instance.expects(:update_tag).never
    @forwarder.expects(:execute_cloud_request).with do |actual_params|
      actual = actual_params[:headers][:params]
      assert_equal 0, actual.count
      true
    end

    @forwarder.forward_request(req, '/api/vulnerability/foo/bar', 'test_controller', @user, @organization, @location)

    # This test asserts the parameters that are sent to the execute_cloud_request method.
    # This is done by setting the expectation before the actual call.
  end

  test 'should merge URI params in GET requests' do
    user_agent = { :foo => :bar }
    params = { :page => 5, :per_page => 42 }

    req = ActionDispatch::Request.new(
      'REQUEST_URI' => '/api/vulnerability/v1/cves/abc-123/affected_systems',
      'REQUEST_METHOD' => 'GET',
      'HTTP_USER_AGENT' => user_agent,
      'rack.input' => ::Puma::NullIO.new,
      'action_dispatch.request.query_parameters' => params
    )

    ::ForemanRhCloud::TagsAuth.any_instance.expects(:update_tag)
    @forwarder.expects(:execute_cloud_request).with do |actual_params|
      actual = actual_params[:headers][:params]
      assert_equal "U:\"#{@user.login}\"O:\"#{@organization.name}\"L:\"#{@location.name}\"", tag_value(actual.find { |param| param[0] == :tag && tag_name(param[1]) =~ /#{ForemanRhCloud::TagsAuth::TAG_NAME}/ }[1])
      assert_equal 5, actual.find { |param| param[0] == :page }[1]
      assert_equal 42, actual.find { |param| param[0] == :per_page }[1]
      true
    end

    @forwarder.forward_request(req, '/api/vulnerability/v1/cves/abc-123/affected_systems', 'test_controller', @user, @organization, @location)
    # This test asserts the parameters that are sent to the execute_cloud_request method.
    # This is done by setting the expectation before the actual call.
  end

  test 'should not scope POST requests' do
    post_data = 'Random POST data'
    req = ActionDispatch::Request.new(
      'REQUEST_URI' => '/foo/bar',
      'REQUEST_METHOD' => 'POST',
      'rack.input' => ::Puma::NullIO.new,
      'RAW_POST_DATA' => post_data
    )

    ::ForemanRhCloud::TagsAuth.any_instance.expects(:update_tag).never
    @forwarder.expects(:execute_cloud_request).with do |actual_params|
      actual = actual_params[:headers][:params]
      assert_equal 0, actual.count
      true
    end

    @forwarder.forward_request(req, '/api/vulnerability/v1/cves', 'test_controller', @user, @organization, @location)

    # This test asserts the parameters that are sent to the execute_cloud_request method.
    # This is done by setting the expectation before the actual call.
  end

  test 'should not scope PUT requests' do
    put_data = 'Random PUT data'
    req = ActionDispatch::Request.new(
      'REQUEST_URI' => '/foo/bar',
      'REQUEST_METHOD' => 'PUT',
      'rack.input' => ::Puma::NullIO.new,
      'RAW_POST_DATA' => put_data
    )

    ::ForemanRhCloud::TagsAuth.any_instance.expects(:update_tag).never
    @forwarder.expects(:execute_cloud_request).with do |actual_params|
      actual = actual_params[:headers][:params]
      assert_equal 0, actual.count
      true
    end

    @forwarder.forward_request(req, '/api/vulnerability/v1/cves', 'test_controller', @user, @organization, @location)

    # This test asserts the parameters that are sent to the execute_cloud_request method.
    # This is done by setting the expectation before the actual call.
  end

  test 'should not scope PATCH requests' do
    post_data = 'Random PATCH data'
    req = ActionDispatch::Request.new(
      'REQUEST_URI' => '/foo/bar',
      'REQUEST_METHOD' => 'PATCH',
      'rack.input' => ::Puma::NullIO.new,
      'RAW_POST_DATA' => post_data,
      "action_dispatch.request.path_parameters" => { :format => "json" }
    )

    ::ForemanRhCloud::TagsAuth.any_instance.expects(:update_tag).never
    @forwarder.expects(:execute_cloud_request).with do |actual_params|
      actual = actual_params[:headers][:params]
      assert_equal 0, actual.count
      true
    end

    @forwarder.forward_request(req, '/api/vulnerability/v1/cves', 'test_controller', @user, @organization, @location)

    # This test asserts the parameters that are sent to the execute_cloud_request method.
    # This is done by setting the expectation before the actual call.
  end

  def tag_value(param_value)
    return param_value unless param_value.is_a?(String)

    tag_string = CGI.unescape(param_value)
    tag_string.split('=')[1]
  end

  def tag_name(param_value)
    return param_value unless param_value.is_a?(String)

    tag_string = CGI.unescape(param_value)
    tag_string.split('=')[0]
  end
end
