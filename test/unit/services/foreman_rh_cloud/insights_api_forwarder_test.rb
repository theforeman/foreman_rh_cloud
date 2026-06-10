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

    @user.stubs(:can?).with(:view_vulnerability).returns(true)
    ::ForemanRhCloud::TagsAuth.any_instance.expects(:update_tag)
    @forwarder.expects(:execute_cloud_request).with do |actual_params|
      actual = actual_params[:headers][:params]
      assert_equal "U:\"#{@user.login}\"O:\"#{@organization.name}\"L:\"#{@location.name}\"", tag_value(actual.find { |param| param[0] == :tags && tag_name(param[1]) =~ /#{ForemanRhCloud::TagsAuth::TAG_NAME}/ }[1])
      true
    end

    @forwarder.forward_request(req, '/api/vulnerability/v1/cves/abc-123/affected_systems', 'test_controller', @user, @organization, @location)
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

    @user.stubs(:can?).with(:view_vulnerability).returns(true)
    ::ForemanRhCloud::TagsAuth.any_instance.expects(:update_tag)
    @forwarder.expects(:execute_cloud_request).with do |actual_params|
      actual = actual_params[:headers][:params]
      assert_equal "U:\"#{@user.login}\"O:\"#{@organization.name}\"L:\"#{@location.name}\"", tag_value(actual.find { |param| param[0] == :tags && tag_name(param[1]) =~ /#{ForemanRhCloud::TagsAuth::TAG_NAME}/ }[1])
      assert_equal 5, actual.find { |param| param[0] == :page }[1]
      assert_equal 42, actual.find { |param| param[0] == :per_page }[1]
      true
    end

    @forwarder.forward_request(req, '/api/vulnerability/v1/cves/abc-123/affected_systems', 'test_controller', @user, @organization, @location)
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
  end

  test 'scope_request? should return tag_name for scoped requests' do
    get_req = ActionDispatch::Request.new(
      'REQUEST_URI' => '/api/vulnerability/v1/vulnerabilities/cves',
      'REQUEST_METHOD' => 'GET',
      'rack.input' => ::Puma::NullIO.new
    )

    result = @forwarder.send(:scope_request?, get_req, 'api/vulnerability/v1/vulnerabilities/cves')
    assert_equal :tags, result
  end

  test 'scope_request? should return nil for non-GET requests' do
    post_req = ActionDispatch::Request.new(
      'REQUEST_URI' => '/api/vulnerability/v1/cves',
      'REQUEST_METHOD' => 'POST',
      'rack.input' => ::Puma::NullIO.new
    )

    result = @forwarder.send(:scope_request?, post_req, '/api/vulnerability/v1/cves')
    assert_nil result
  end

  test 'scope_request? should return nil for unmatched paths' do
    get_req = ActionDispatch::Request.new(
      'REQUEST_URI' => '/api/unmatched/path',
      'REQUEST_METHOD' => 'GET',
      'rack.input' => ::Puma::NullIO.new
    )

    result = @forwarder.send(:scope_request?, get_req, '/api/unmatched/path')
    assert_nil result
  end

  test 'scope_request? should return tag_name for compliance systems endpoint' do
    get_req = ActionDispatch::Request.new(
      'REQUEST_URI' => '/api/compliance/v2/systems',
      'REQUEST_METHOD' => 'GET',
      'rack.input' => ::Puma::NullIO.new
    )

    result = @forwarder.send(:scope_request?, get_req, 'api/compliance/v2/systems')
    assert_equal :tags, result
  end

  test 'scope_request? should return tag_name for compliance report systems endpoint' do
    get_req = ActionDispatch::Request.new(
      'REQUEST_URI' => '/api/compliance/v2/reports/report-123/systems',
      'REQUEST_METHOD' => 'GET',
      'rack.input' => ::Puma::NullIO.new
    )

    result = @forwarder.send(:scope_request?, get_req, 'api/compliance/v2/reports/report-123/systems')
    assert_equal :tags, result
  end

  test 'scope_request? should return tag_name for individual compliance system endpoint' do
    get_req = ActionDispatch::Request.new(
      'REQUEST_URI' => '/api/compliance/v2/systems/system-456',
      'REQUEST_METHOD' => 'GET',
      'rack.input' => ::Puma::NullIO.new
    )

    result = @forwarder.send(:scope_request?, get_req, 'api/compliance/v2/systems/system-456')
    assert_equal :tags, result
  end

  test 'scope_request? should return tag_name for system policies endpoint' do
    get_req = ActionDispatch::Request.new(
      'REQUEST_URI' => '/api/compliance/v2/systems/system-456/policies',
      'REQUEST_METHOD' => 'GET',
      'rack.input' => ::Puma::NullIO.new
    )

    result = @forwarder.send(:scope_request?, get_req, 'api/compliance/v2/systems/system-456/policies')
    assert_equal :tags, result
  end

  test 'scope_request? should return tag_name for system reports endpoint' do
    get_req = ActionDispatch::Request.new(
      'REQUEST_URI' => '/api/compliance/v2/systems/system-456/reports',
      'REQUEST_METHOD' => 'GET',
      'rack.input' => ::Puma::NullIO.new
    )

    result = @forwarder.send(:scope_request?, get_req, 'api/compliance/v2/systems/system-456/reports')
    assert_equal :tags, result
  end

  test 'prepare_tags should use provided tag_name' do
    result = @forwarder.send(:prepare_tags, @user, @organization, @location, :custom_tag)

    assert_equal 1, result.length
    assert_equal :custom_tag, result[0][0]
    assert_equal "U:\"#{@user.login}\"O:\"#{@organization.name}\"L:\"#{@location.name}\"", tag_value(result[0][1])
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

  # Helper to build test requests with minimal boilerplate
  def build_request(method:, uri:, params: {}, data: nil)
    env = {
      'REQUEST_URI' => uri,
      'REQUEST_METHOD' => method,
      'rack.input' => ::Puma::NullIO.new,
      'action_dispatch.request.query_parameters' => params,
    }
    env['RAW_POST_DATA'] = data if data
    env['action_dispatch.request.path_parameters'] = { format: 'json' } if method == 'PATCH'
    ActionDispatch::Request.new(env)
  end

  # Permission enforcement tests

  # GET /api/inventory/v1/hosts is a shared dependency - view_compliance OR view_vulnerability grants access
  test 'should allow GET request to inventory hosts when user has view_vulnerability permission' do
    user_agent = { :foo => :bar }
    params = {}

    req = ActionDispatch::Request.new(
      'REQUEST_URI' => '/api/inventory/v1/hosts',
      'REQUEST_METHOD' => 'GET',
      'HTTP_USER_AGENT' => user_agent,
      'rack.input' => ::Puma::NullIO.new,
      'action_dispatch.request.query_parameters' => params
    )

    @user.stubs(:can?).with(:view_compliance).returns(false)
    @user.stubs(:can?).with(:view_vulnerability).returns(true)
    ::ForemanRhCloud::TagsAuth.any_instance.expects(:update_tag)
    @forwarder.expects(:execute_cloud_request).returns(true)

    @forwarder.forward_request(req, 'api/inventory/v1/hosts', 'test_controller', @user, @organization, @location)
  end

  test 'should allow GET request to inventory hosts when user has view_compliance permission' do
    req = build_request(method: 'GET', uri: '/api/inventory/v1/hosts')

    @user.stubs(:can?).with(:view_compliance).returns(true)
    @user.stubs(:can?).with(:view_vulnerability).returns(false)
    ::ForemanRhCloud::TagsAuth.any_instance.expects(:update_tag)
    @forwarder.expects(:execute_cloud_request).returns(true)

    @forwarder.forward_request(req, 'api/inventory/v1/hosts', 'test_controller', @user, @organization, @location)
  end

  test 'should deny GET request to inventory hosts when user lacks both view_compliance and view_vulnerability' do
    user_agent = { :foo => :bar }
    params = {}

    req = ActionDispatch::Request.new(
      'REQUEST_URI' => '/api/inventory/v1/hosts',
      'REQUEST_METHOD' => 'GET',
      'HTTP_USER_AGENT' => user_agent,
      'rack.input' => ::Puma::NullIO.new,
      'action_dispatch.request.query_parameters' => params
    )

    @user.stubs(:can?).with(:view_compliance).returns(false)
    @user.stubs(:can?).with(:view_vulnerability).returns(false)

    assert_raises(::Foreman::PermissionMissingException) do
      @forwarder.forward_request(req, 'api/inventory/v1/hosts', 'test_controller', @user, @organization, @location)
    end
  end

  # POST /api/vulnerability/v1/vulnerabilities/cves requires view_vulnerability
  test 'should deny POST request to vulnerabilities cves when user lacks view_vulnerability permission' do
    post_data = '{"test": "data"}'
    req = ActionDispatch::Request.new(
      'REQUEST_URI' => '/api/vulnerability/v1/vulnerabilities/cves',
      'REQUEST_METHOD' => 'POST',
      'rack.input' => ::Puma::NullIO.new,
      'RAW_POST_DATA' => post_data
    )

    @user.stubs(:can?).with(:view_vulnerability).returns(false)

    assert_raises(::Foreman::PermissionMissingException) do
      @forwarder.forward_request(req, 'api/vulnerability/v1/vulnerabilities/cves', 'test_controller', @user, @organization, @location)
    end
  end

  # PATCH /api/vulnerability/v1/status requires edit_vulnerability
  test 'should allow PATCH request to vulnerability status when user has edit_vulnerability permission' do
    patch_data = '{"status": "resolved"}'
    req = ActionDispatch::Request.new(
      'REQUEST_URI' => '/api/vulnerability/v1/status',
      'REQUEST_METHOD' => 'PATCH',
      'rack.input' => ::Puma::NullIO.new,
      'RAW_POST_DATA' => patch_data,
      "action_dispatch.request.path_parameters" => { :format => "json" }
    )

    @user.stubs(:can?).with(:edit_vulnerability).returns(true)
    @forwarder.expects(:execute_cloud_request).returns(true)

    @forwarder.forward_request(req, 'api/vulnerability/v1/status', 'test_controller', @user, @organization, @location)
  end

  test 'should deny PATCH request to vulnerability status when user lacks edit_vulnerability permission' do
    patch_data = '{"status": "resolved"}'
    req = ActionDispatch::Request.new(
      'REQUEST_URI' => '/api/vulnerability/v1/status',
      'REQUEST_METHOD' => 'PATCH',
      'rack.input' => ::Puma::NullIO.new,
      'RAW_POST_DATA' => patch_data,
      "action_dispatch.request.path_parameters" => { :format => "json" }
    )

    @user.stubs(:can?).with(:edit_vulnerability).returns(false)

    assert_raises(::Foreman::PermissionMissingException) do
      @forwarder.forward_request(req, 'api/vulnerability/v1/status', 'test_controller', @user, @organization, @location)
    end
  end

  # Data-driven tests for required_permission_for
  PERMISSION_MAPPINGS = [
    # Shared inventory hosts endpoint - either view_compliance or view_vulnerability grants GET access
    { path: 'api/inventory/v1/hosts', method: 'GET', expected: [:view_compliance, :view_vulnerability] },
    { path: 'api/inventory/v1/hosts/abc-123', method: 'GET', expected: [:view_compliance, :view_vulnerability] },
    # Compliance endpoints
    { path: 'api/compliance/v2/policies', method: 'GET', expected: :view_compliance },
    { path: 'api/compliance/v2/policies', method: 'POST', expected: :edit_compliance },
    { path: 'api/compliance/v2/policies/policy-123', method: 'GET', expected: :view_compliance },
    { path: 'api/compliance/v2/policies/policy-123', method: 'DELETE', expected: :edit_compliance },
    { path: 'api/compliance/v2/policies/policy-123', method: 'PATCH', expected: :edit_compliance },
    { path: 'api/compliance/v2/policies/policy-123/systems', method: 'GET', expected: :view_compliance },
    { path: 'api/compliance/v2/policies/policy-123/systems', method: 'POST', expected: :edit_compliance },
    { path: 'api/compliance/v2/policies/policy-123/systems/system-456', method: 'GET', expected: :view_compliance },
    { path: 'api/compliance/v2/policies/policy-123/systems/system-456', method: 'DELETE', expected: :edit_compliance },
    { path: 'api/compliance/v2/policies/policy-123/systems/system-456', method: 'PATCH', expected: :edit_compliance },
    { path: 'api/compliance/v2/policies/policy-123/tailorings', method: 'GET', expected: :view_compliance },
    { path: 'api/compliance/v2/policies/policy-123/tailorings', method: 'POST', expected: :edit_compliance },
    { path: 'api/compliance/v2/policies/policy-123/tailorings/tailoring-789', method: 'GET', expected: :view_compliance },
    { path: 'api/compliance/v2/policies/policy-123/tailorings/tailoring-789', method: 'PATCH', expected: :edit_compliance },
    { path: 'api/compliance/v2/policies/policy-123/tailorings/tailoring-789/rules', method: 'GET', expected: :view_compliance },
    { path: 'api/compliance/v2/policies/policy-123/tailorings/tailoring-789/rules', method: 'POST', expected: :edit_compliance },
    { path: 'api/compliance/v2/policies/policy-123/tailorings/tailoring-789/rules/rule-999', method: 'GET', expected: :view_compliance },
    { path: 'api/compliance/v2/policies/policy-123/tailorings/tailoring-789/rules/rule-999', method: 'DELETE', expected: :edit_compliance },
    { path: 'api/compliance/v2/policies/policy-123/tailorings/tailoring-789/rules/rule-999', method: 'PATCH', expected: :edit_compliance },
    { path: 'api/compliance/v2/reports', method: 'GET', expected: :view_compliance },
    { path: 'api/compliance/v2/reports/report-123', method: 'GET', expected: :view_compliance },
    { path: 'api/compliance/v2/reports/report-123', method: 'DELETE', expected: :edit_compliance },
    { path: 'api/compliance/v2/reports/report-123/systems', method: 'GET', expected: :view_compliance },
    { path: 'api/compliance/v2/reports/report-123/systems/system-456', method: 'GET', expected: :view_compliance },
    { path: 'api/compliance/v2/reports/report-123/systems/os_versions', method: 'GET', expected: :view_compliance },
    { path: 'api/compliance/v2/policies/policy-123/systems/os_versions', method: 'GET', expected: :view_compliance },
    { path: 'api/compliance/v2/systems', method: 'GET', expected: :view_compliance },
    { path: 'api/compliance/v2/systems/system-456', method: 'GET', expected: :view_compliance },
    { path: 'api/compliance/v2/systems/os_versions', method: 'GET', expected: :view_compliance },
    { path: 'api/compliance/v2/systems/system-456/policies', method: 'GET', expected: :view_compliance },
    { path: 'api/compliance/v2/systems/system-456/reports', method: 'GET', expected: :view_compliance },
    { path: 'api/compliance/v2/profiles', method: 'GET', expected: :view_compliance },
    # Vulnerability endpoints
    { path: 'api/vulnerability/v1/vulnerabilities/cves', method: 'POST', expected: :view_vulnerability },
    { path: 'api/vulnerability/v1/status', method: 'PATCH', expected: :edit_vulnerability },
    { path: 'api/vulnerability/v1/cves/status', method: 'PATCH', expected: :edit_vulnerability },
    { path: 'api/vulnerability/v1/cves/business_risk', method: 'PATCH', expected: :edit_vulnerability },
    { path: 'api/vulnerability/v1/systems/opt_out', method: 'PATCH', expected: :edit_vulnerability },
    { path: 'api/vulnerability/v1/dashbar', method: 'GET', expected: :view_vulnerability },
    { path: 'api/vulnerability/v1/cves/CVE-2024-1234/affected_systems', method: 'GET', expected: :view_vulnerability },
    # Endpoints without tags support (still require view_vulnerability)
    { path: 'api/vulnerability/v1/apistatus', method: 'GET', expected: :view_vulnerability },
    { path: 'api/vulnerability/v1/version', method: 'GET', expected: :view_vulnerability },
    { path: 'api/vulnerability/v1/business_risk', method: 'GET', expected: :view_vulnerability },
    { path: 'api/vulnerability/v1/announcement', method: 'GET', expected: :view_vulnerability },
    { path: 'api/vulnerability/v1/cves/CVE-2024-1234', method: 'GET', expected: :view_vulnerability },
    { path: 'api/vulnerability/v1/playbooks/abc-123', method: 'GET', expected: :view_vulnerability },
    { path: 'api/vulnerability/v1/report/abc-123', method: 'GET', expected: :view_vulnerability },
    # Advisor endpoints
    { path: 'api/insights/v1/stats/systems', method: 'GET', expected: :view_advisor },
    { path: 'api/insights/v1/ack/', method: 'POST', expected: :edit_advisor },
    { path: 'api/insights/v1/ack/rule_id', method: 'DELETE', expected: :edit_advisor },
    { path: 'api/insights/v1/hostack/', method: 'POST', expected: :edit_advisor },
    { path: 'api/insights/v1/hostack/123', method: 'DELETE', expected: :edit_advisor },
    { path: 'api/insights/v1/rule/test_rule/unack_hosts', method: 'POST', expected: :edit_advisor },
    # Unknown endpoints
    { path: 'api/unknown/endpoint', method: 'GET', expected: nil },
  ].freeze

  PERMISSION_MAPPINGS.each do |mapping|
    test "required_permission_for returns #{mapping[:expected].inspect} for #{mapping[:method]} #{mapping[:path]}" do
      permission = @forwarder.send(:required_permission_for, mapping[:path], mapping[:method])
      assert_equal mapping[:expected], permission
    end
  end

  # Advisor permission integration tests
  test 'should allow GET request to insights endpoint when user has view_advisor permission' do
    req = build_request(method: 'GET', uri: '/api/insights/v1/stats/systems')

    @user.stubs(:can?).with(:view_advisor).returns(true)
    ::ForemanRhCloud::TagsAuth.any_instance.expects(:update_tag)
    @forwarder.expects(:execute_cloud_request).returns(true)

    @forwarder.forward_request(req, 'api/insights/v1/stats/systems', 'test_controller', @user, @organization, @location)
  end

  test 'should deny GET request to insights endpoint when user lacks view_advisor permission' do
    req = build_request(method: 'GET', uri: '/api/insights/v1/stats/systems')

    @user.stubs(:can?).with(:view_advisor).returns(false)

    assert_raises(::Foreman::PermissionMissingException) do
      @forwarder.forward_request(req, 'api/insights/v1/stats/systems', 'test_controller', @user, @organization, @location)
    end
  end

  test 'should allow POST request to insights ack when user has edit_advisor permission' do
    req = build_request(method: 'POST', uri: '/api/insights/v1/ack/', data: '{"rule_id": "test|RULE"}')

    @user.stubs(:can?).with(:edit_advisor).returns(true)
    @forwarder.expects(:execute_cloud_request).returns(true)

    @forwarder.forward_request(req, 'api/insights/v1/ack/', 'test_controller', @user, @organization, @location)
  end

  test 'should deny POST request to insights ack when user lacks edit_advisor permission' do
    req = build_request(method: 'POST', uri: '/api/insights/v1/ack/', data: '{"rule_id": "test|RULE"}')

    @user.stubs(:can?).with(:edit_advisor).returns(false)

    assert_raises(::Foreman::PermissionMissingException) do
      @forwarder.forward_request(req, 'api/insights/v1/ack/', 'test_controller', @user, @organization, @location)
    end
  end

  # Compliance permission integration tests
  test 'should allow GET request to compliance policies when user has view_compliance permission' do
    req = build_request(method: 'GET', uri: '/api/compliance/v2/policies')

    @user.stubs(:can?).with(:view_compliance).returns(true)
    @forwarder.expects(:execute_cloud_request).returns(true)

    @forwarder.forward_request(req, 'api/compliance/v2/policies', 'test_controller', @user, @organization, @location)
  end

  test 'should deny GET request to compliance policies when user lacks view_compliance permission' do
    req = build_request(method: 'GET', uri: '/api/compliance/v2/policies')

    @user.stubs(:can?).with(:view_compliance).returns(false)

    assert_raises(::Foreman::PermissionMissingException) do
      @forwarder.forward_request(req, 'api/compliance/v2/policies', 'test_controller', @user, @organization, @location)
    end
  end

  test 'should allow POST request to compliance policies when user has edit_compliance permission' do
    req = build_request(method: 'POST', uri: '/api/compliance/v2/policies', data: '{"name": "test-policy"}')

    @user.stubs(:can?).with(:edit_compliance).returns(true)
    @forwarder.expects(:execute_cloud_request).returns(true)

    @forwarder.forward_request(req, 'api/compliance/v2/policies', 'test_controller', @user, @organization, @location)
  end

  test 'should deny POST request to compliance policies when user lacks edit_compliance permission' do
    req = build_request(method: 'POST', uri: '/api/compliance/v2/policies', data: '{"name": "test-policy"}')

    @user.stubs(:can?).with(:edit_compliance).returns(false)

    assert_raises(::Foreman::PermissionMissingException) do
      @forwarder.forward_request(req, 'api/compliance/v2/policies', 'test_controller', @user, @organization, @location)
    end
  end

  test 'should allow PATCH request to compliance policy when user has edit_compliance permission' do
    req = build_request(method: 'PATCH', uri: '/api/compliance/v2/policies/policy-123', data: '{"name": "updated-policy"}')

    @user.stubs(:can?).with(:edit_compliance).returns(true)
    @forwarder.expects(:execute_cloud_request).returns(true)

    @forwarder.forward_request(req, 'api/compliance/v2/policies/policy-123', 'test_controller', @user, @organization, @location)
  end

  test 'should deny PATCH request to compliance policy when user lacks edit_compliance permission' do
    req = build_request(method: 'PATCH', uri: '/api/compliance/v2/policies/policy-123', data: '{"name": "updated-policy"}')

    @user.stubs(:can?).with(:edit_compliance).returns(false)

    assert_raises(::Foreman::PermissionMissingException) do
      @forwarder.forward_request(req, 'api/compliance/v2/policies/policy-123', 'test_controller', @user, @organization, @location)
    end
  end

  test 'should allow DELETE request to compliance policy when user has edit_compliance permission' do
    req = build_request(method: 'DELETE', uri: '/api/compliance/v2/policies/policy-123')

    @user.stubs(:can?).with(:edit_compliance).returns(true)
    @forwarder.expects(:execute_cloud_request).returns(true)

    @forwarder.forward_request(req, 'api/compliance/v2/policies/policy-123', 'test_controller', @user, @organization, @location)
  end

  test 'should deny DELETE request to compliance policy when user lacks edit_compliance permission' do
    req = build_request(method: 'DELETE', uri: '/api/compliance/v2/policies/policy-123')

    @user.stubs(:can?).with(:edit_compliance).returns(false)

    assert_raises(::Foreman::PermissionMissingException) do
      @forwarder.forward_request(req, 'api/compliance/v2/policies/policy-123', 'test_controller', @user, @organization, @location)
    end
  end

  test 'should allow POST request to compliance policy systems when user has edit_compliance permission' do
    req = build_request(method: 'POST', uri: '/api/compliance/v2/policies/policy-123/systems', data: '{"id": "system-456"}')

    @user.stubs(:can?).with(:edit_compliance).returns(true)
    @forwarder.expects(:execute_cloud_request).returns(true)

    @forwarder.forward_request(req, 'api/compliance/v2/policies/policy-123/systems', 'test_controller', @user, @organization, @location)
  end

  test 'should deny POST request to compliance policy systems when user lacks edit_compliance permission' do
    req = build_request(method: 'POST', uri: '/api/compliance/v2/policies/policy-123/systems', data: '{"id": "system-456"}')

    @user.stubs(:can?).with(:edit_compliance).returns(false)

    assert_raises(::Foreman::PermissionMissingException) do
      @forwarder.forward_request(req, 'api/compliance/v2/policies/policy-123/systems', 'test_controller', @user, @organization, @location)
    end
  end

  test 'should allow DELETE request to compliance report when user has edit_compliance permission' do
    req = build_request(method: 'DELETE', uri: '/api/compliance/v2/reports/report-123')

    @user.stubs(:can?).with(:edit_compliance).returns(true)
    @forwarder.expects(:execute_cloud_request).returns(true)

    @forwarder.forward_request(req, 'api/compliance/v2/reports/report-123', 'test_controller', @user, @organization, @location)
  end

  test 'should deny DELETE request to compliance report when user lacks edit_compliance permission' do
    req = build_request(method: 'DELETE', uri: '/api/compliance/v2/reports/report-123')

    @user.stubs(:can?).with(:edit_compliance).returns(false)

    assert_raises(::Foreman::PermissionMissingException) do
      @forwarder.forward_request(req, 'api/compliance/v2/reports/report-123', 'test_controller', @user, @organization, @location)
    end
  end

  test 'should allow DELETE request to compliance tailoring rule when user has edit_compliance permission' do
    req = build_request(method: 'DELETE', uri: '/api/compliance/v2/policies/policy-123/tailorings/tailoring-789/rules/rule-999')

    @user.stubs(:can?).with(:edit_compliance).returns(true)
    @forwarder.expects(:execute_cloud_request).returns(true)

    @forwarder.forward_request(req, 'api/compliance/v2/policies/policy-123/tailorings/tailoring-789/rules/rule-999', 'test_controller', @user, @organization, @location)
  end

  test 'should deny DELETE request to compliance tailoring rule when user lacks edit_compliance permission' do
    req = build_request(method: 'DELETE', uri: '/api/compliance/v2/policies/policy-123/tailorings/tailoring-789/rules/rule-999')

    @user.stubs(:can?).with(:edit_compliance).returns(false)

    assert_raises(::Foreman::PermissionMissingException) do
      @forwarder.forward_request(req, 'api/compliance/v2/policies/policy-123/tailorings/tailoring-789/rules/rule-999', 'test_controller', @user, @organization, @location)
    end
  end

  # Edge case: anonymous user
  test 'should deny request when user is nil' do
    req = build_request(method: 'GET', uri: '/api/insights/v1/stats/systems')

    assert_raises(::Foreman::PermissionMissingException) do
      @forwarder.forward_request(req, 'api/insights/v1/stats/systems', 'test_controller', nil, @organization, @location)
    end
  end
end
