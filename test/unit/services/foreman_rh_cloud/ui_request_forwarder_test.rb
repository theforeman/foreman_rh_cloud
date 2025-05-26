require 'test_plugin_helper'
require 'puma/null_io'

class UIRequestForwarderTest < ActiveSupport::TestCase
  include MockCerts

  setup do
    @forwarder = ::ForemanRhCloud::UIRequestForwarder.new
    @user = FactoryBot.build(:user)
    @organization = FactoryBot.build(:organization)
    @location = FactoryBot.build(:location)

    ForemanRhCloud.stubs(:cert_base_url).returns('https://cert.cloud.example.com')
  end

  test 'should scope GET requests with proper tags' do
    user_agent = { :foo => :bar }
    params = {}

    req = ActionDispatch::Request.new(
      'REQUEST_URI' => '/foo/bar',
      'REQUEST_METHOD' => 'GET',
      'HTTP_USER_AGENT' => user_agent,
      'rack.input' => ::Puma::NullIO.new,
      'action_dispatch.request.query_parameters' => params
    )

    actual = @forwarder.prepare_forward_params(req, user: @user, organization: @organization, location: @location)

    assert_equal @user.name, tag_value(actual.find { |param| param[0] == :tag && tag_name(param[1]) =~ %r{satellite/user} }[1])
    assert_equal @organization.name, tag_value(actual.find { |param| param[0] == :tag && tag_name(param[1]) =~ %r{satellite/organization} }[1])
    assert_equal @location.name, tag_value(actual.find { |param| param[0] == :tag && tag_name(param[1]) =~ %r{satellite/location} }[1])
  end

  test 'should merge URI params in GET requests' do
    user_agent = { :foo => :bar }
    params = { :page => 5, :per_page => 42 }

    req = ActionDispatch::Request.new(
      'REQUEST_URI' => '/foo/bar',
      'REQUEST_METHOD' => 'GET',
      'HTTP_USER_AGENT' => user_agent,
      'rack.input' => ::Puma::NullIO.new,
      'action_dispatch.request.query_parameters' => params
    )

    actual = @forwarder.prepare_forward_params(req, user: @user, organization: @organization, location: @location)

    assert_equal @user.name, tag_value(actual.find { |param| param[0] == :tag && tag_name(param[1]) =~ %r{satellite/user} }[1])
    assert_equal @organization.name, tag_value(actual.find { |param| param[0] == :tag && tag_name(param[1]) =~ %r{satellite/organization} }[1])
    assert_equal @location.name, tag_value(actual.find { |param| param[0] == :tag && tag_name(param[1]) =~ %r{satellite/location} }[1])
    assert_equal 5, actual.find { |param| param[0] == :page }[1]
    assert_equal 42, actual.find { |param| param[0] == :per_page }[1]
  end

  test 'should not scope POST requests' do
    post_data = 'Random POST data'
    req = ActionDispatch::Request.new(
      'REQUEST_URI' => '/foo/bar',
      'REQUEST_METHOD' => 'POST',
      'rack.input' => ::Puma::NullIO.new,
      'RAW_POST_DATA' => post_data
    )
    actual = @forwarder.prepare_forward_params(req, user: @user, organization: @organization, location: @location)

    assert_equal 0, actual.length
  end

  test 'should not scope PUT requests' do
    put_data = 'Random PUT data'
    req = ActionDispatch::Request.new(
      'REQUEST_URI' => '/foo/bar',
      'REQUEST_METHOD' => 'PUT',
      'rack.input' => ::Puma::NullIO.new,
      'RAW_POST_DATA' => put_data
    )
    actual = @forwarder.prepare_forward_params(req, user: @user, organization: @organization, location: @location)

    assert_equal 0, actual.length
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
    actual = @forwarder.prepare_forward_params(req, user: @user, organization: @organization, location: @location)

    assert_equal 0, actual.length
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
