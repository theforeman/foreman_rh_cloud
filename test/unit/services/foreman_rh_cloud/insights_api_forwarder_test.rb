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

  test 'should reject GET requests for unknown uris' do
    user_agent = { :foo => :bar }
    params = {}

    req = ActionDispatch::Request.new(
      'REQUEST_URI' => '/api/vulnerability/foo/bar',
      'REQUEST_METHOD' => 'GET',
      'HTTP_USER_AGENT' => user_agent,
      'rack.input' => ::Puma::NullIO.new,
      'action_dispatch.request.query_parameters' => params
    )

    # Unmapped paths should raise UnsupportedOperationError (returns 404)
    assert_raises(::ForemanRhCloud::InsightsApiForwarder::UnsupportedOperationError) do
      @forwarder.forward_request(req, '/api/vulnerability/foo/bar', 'test_controller', @user, @organization, @location)
    end
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

  test 'should reject unmapped POST requests' do
    post_data = 'Random POST data'
    req = ActionDispatch::Request.new(
      'REQUEST_URI' => '/foo/bar',
      'REQUEST_METHOD' => 'POST',
      'rack.input' => ::Puma::NullIO.new,
      'RAW_POST_DATA' => post_data
    )

    # Unmapped POST paths should raise UnsupportedOperationError (returns 404)
    assert_raises(::ForemanRhCloud::InsightsApiForwarder::UnsupportedOperationError) do
      @forwarder.forward_request(req, '/foo/bar', 'test_controller', @user, @organization, @location)
    end
  end

  test 'should reject unmapped PUT requests' do
    put_data = 'Random PUT data'
    req = ActionDispatch::Request.new(
      'REQUEST_URI' => '/foo/bar',
      'REQUEST_METHOD' => 'PUT',
      'rack.input' => ::Puma::NullIO.new,
      'RAW_POST_DATA' => put_data
    )

    # Unmapped PUT paths should raise UnsupportedOperationError (returns 404)
    assert_raises(::ForemanRhCloud::InsightsApiForwarder::UnsupportedOperationError) do
      @forwarder.forward_request(req, '/foo/bar', 'test_controller', @user, @organization, @location)
    end
  end

  test 'should reject unmapped PATCH requests' do
    post_data = 'Random PATCH data'
    req = ActionDispatch::Request.new(
      'REQUEST_URI' => '/foo/bar',
      'REQUEST_METHOD' => 'PATCH',
      'rack.input' => ::Puma::NullIO.new,
      'RAW_POST_DATA' => post_data,
      "action_dispatch.request.path_parameters" => { :format => "json" }
    )

    # Unmapped PATCH paths should raise UnsupportedOperationError (returns 404)
    assert_raises(::ForemanRhCloud::InsightsApiForwarder::UnsupportedOperationError) do
      @forwarder.forward_request(req, '/foo/bar', 'test_controller', @user, @organization, @location)
    end
  end

  test 'scope_request? should return tag_name for scoped requests' do
    get_req = ActionDispatch::Request.new(
      'REQUEST_URI' => '/api/vulnerability/v1/cves/CVE-2024-1234/affected_systems',
      'REQUEST_METHOD' => 'GET',
      'rack.input' => ::Puma::NullIO.new
    )

    result = @forwarder.send(:scope_request?, get_req, 'api/vulnerability/v1/cves/CVE-2024-1234/affected_systems')
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

  test 'scope_request? should return tag_name for report test_results list endpoint' do
    get_req = ActionDispatch::Request.new(
      'REQUEST_URI' => '/api/compliance/v2/reports/report-123/test_results',
      'REQUEST_METHOD' => 'GET',
      'rack.input' => ::Puma::NullIO.new
    )

    result = @forwarder.send(:scope_request?, get_req, 'api/compliance/v2/reports/report-123/test_results')
    assert_equal :tags, result
  end

  test 'scope_request? should return tag_name for individual test_result endpoint' do
    get_req = ActionDispatch::Request.new(
      'REQUEST_URI' => '/api/compliance/v2/reports/report-123/test_results/result-456',
      'REQUEST_METHOD' => 'GET',
      'rack.input' => ::Puma::NullIO.new
    )

    result = @forwarder.send(:scope_request?, get_req, 'api/compliance/v2/reports/report-123/test_results/result-456')
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

  # Inventory hosts OR-logic: any single permission is sufficient
  test 'should allow GET request to inventory hosts when user has view_vulnerability permission' do
    req = build_request(method: 'GET', uri: '/api/inventory/v1/hosts')

    @user.stubs(:can?).with(:view_advisor).returns(false)
    @user.stubs(:can?).with(:view_compliance).returns(false)
    @user.stubs(:can?).with(:view_vulnerability).returns(true)
    ::ForemanRhCloud::TagsAuth.any_instance.expects(:update_tag)
    @forwarder.expects(:execute_cloud_request).returns(true)

    @forwarder.forward_request(req, 'api/inventory/v1/hosts', 'test_controller', @user, @organization, @location)
  end

  test 'should allow GET request to inventory hosts when user has view_compliance permission' do
    req = build_request(method: 'GET', uri: '/api/inventory/v1/hosts')

    @user.stubs(:can?).with(:view_advisor).returns(false)
    @user.stubs(:can?).with(:view_compliance).returns(true)
    @user.stubs(:can?).with(:view_vulnerability).returns(false)
    ::ForemanRhCloud::TagsAuth.any_instance.expects(:update_tag)
    @forwarder.expects(:execute_cloud_request).returns(true)

    @forwarder.forward_request(req, 'api/inventory/v1/hosts', 'test_controller', @user, @organization, @location)
  end

  # Edge case: anonymous user
  test 'should deny request when user is nil' do
    req = build_request(method: 'GET', uri: '/api/insights/v1/stats/systems')

    assert_raises(::Foreman::PermissionMissingException) do
      @forwarder.forward_request(req, 'api/insights/v1/stats/systems', 'test_controller', nil, @organization, @location)
    end
  end

  # Comprehensive permission matrix tests
  #
  # For each path, every HTTP method is tested via forward_request:
  # - Mapped operations (method listed in permissions) → user lacking permission gets PermissionMissingException
  # - Unmapped operations (method not listed) → rejected with UnsupportedOperationError, execute_cloud_request never called
  #
  # Allow behavior (user WITH permission) is tested by the happy-path tests above.

  HTTP_METHODS = %w[GET HEAD POST PUT PATCH DELETE OPTIONS].freeze

  PERMISSION_MAPPINGS = [
    # Inventory hosts - shared dependency (any one of three permissions grants GET access)
    { path: 'api/inventory/v1/hosts', permissions: { 'GET' => [:view_advisor, :view_compliance, :view_vulnerability] } },
    { path: 'api/inventory/v1/hosts/abc-123', permissions: { 'GET' => [:view_advisor, :view_compliance, :view_vulnerability] } },
    # Compliance - policies
    { path: 'api/compliance/v2/policies', permissions: { 'GET' => :view_compliance, 'POST' => :edit_compliance } },
    { path: 'api/compliance/v2/policies/policy-123', permissions: { 'GET' => :view_compliance, 'DELETE' => :edit_compliance, 'PATCH' => :edit_compliance } },
    # Compliance - policy systems
    { path: 'api/compliance/v2/policies/policy-123/systems', permissions: { 'GET' => :view_compliance, 'POST' => :edit_compliance, 'DELETE' => :edit_compliance, 'PATCH' => :edit_compliance } },
    { path: 'api/compliance/v2/policies/policy-123/systems/system-456', permissions: { 'GET' => :view_compliance, 'DELETE' => :edit_compliance, 'PATCH' => :edit_compliance } },
    # Compliance - tailorings
    { path: 'api/compliance/v2/policies/policy-123/tailorings', permissions: { 'GET' => :view_compliance, 'POST' => :edit_compliance } },
    { path: 'api/compliance/v2/policies/policy-123/tailorings/tailoring-789', permissions: { 'GET' => :view_compliance, 'POST' => :edit_compliance, 'PATCH' => :edit_compliance } },
    # Compliance - tailoring rules
    { path: 'api/compliance/v2/policies/policy-123/tailorings/tailoring-789/rules', permissions: { 'GET' => :view_compliance, 'POST' => :edit_compliance } },
    { path: 'api/compliance/v2/policies/policy-123/tailorings/tailoring-789/rules/rule-999', permissions: { 'GET' => :view_compliance, 'DELETE' => :edit_compliance, 'PATCH' => :edit_compliance } },
    # Compliance - reports
    { path: 'api/compliance/v2/reports', permissions: { 'GET' => :view_compliance } },
    { path: 'api/compliance/v2/reports/report-123', permissions: { 'GET' => :view_compliance, 'DELETE' => :edit_compliance } },
    { path: 'api/compliance/v2/reports/report-123/systems', permissions: { 'GET' => :view_compliance } },
    { path: 'api/compliance/v2/reports/report-123/systems/system-456', permissions: { 'GET' => :view_compliance } },
    { path: 'api/compliance/v2/reports/report-123/systems/os_versions', permissions: { 'GET' => :view_compliance } },
    # Compliance - test results
    { path: 'api/compliance/v2/reports/report-123/test_results', permissions: { 'GET' => :view_compliance } },
    { path: 'api/compliance/v2/reports/report-123/test_results/result-456', permissions: { 'GET' => :view_compliance } },
    # Compliance - policy system os_versions
    { path: 'api/compliance/v2/policies/policy-123/systems/os_versions', permissions: { 'GET' => :view_compliance } },
    # Compliance - systems
    { path: 'api/compliance/v2/systems', permissions: { 'GET' => :view_compliance } },
    { path: 'api/compliance/v2/systems/system-456', permissions: { 'GET' => :view_compliance } },
    { path: 'api/compliance/v2/systems/os_versions', permissions: { 'GET' => :view_compliance } },
    { path: 'api/compliance/v2/systems/system-456/policies', permissions: { 'GET' => :view_compliance } },
    { path: 'api/compliance/v2/systems/system-456/reports', permissions: { 'GET' => :view_compliance } },
    # Compliance - catch-all
    { path: 'api/compliance/v2/profiles', permissions: { 'GET' => :view_compliance } },
    # Vulnerability - CVEs list (POST only)
    { path: 'api/vulnerability/v1/vulnerabilities/cves', permissions: { 'POST' => :view_vulnerability } },
    # Vulnerability - write-only endpoints (PATCH only)
    { path: 'api/vulnerability/v1/status', permissions: { 'PATCH' => :edit_vulnerability } },
    { path: 'api/vulnerability/v1/cves/status', permissions: { 'PATCH' => :edit_vulnerability } },
    { path: 'api/vulnerability/v1/cves/business_risk', permissions: { 'PATCH' => :edit_vulnerability } },
    { path: 'api/vulnerability/v1/systems/opt_out', permissions: { 'PATCH' => :edit_vulnerability } },
    # Vulnerability - endpoints without tags support (GET only)
    { path: 'api/vulnerability/v1/apistatus', permissions: { 'GET' => :view_vulnerability } },
    { path: 'api/vulnerability/v1/version', permissions: { 'GET' => :view_vulnerability } },
    { path: 'api/vulnerability/v1/business_risk', permissions: { 'GET' => :view_vulnerability } },
    { path: 'api/vulnerability/v1/announcement', permissions: { 'GET' => :view_vulnerability } },
    { path: 'api/vulnerability/v1/cves/CVE-2024-1234', permissions: { 'GET' => :view_vulnerability } },
    { path: 'api/vulnerability/v1/playbooks/abc-123', permissions: { 'GET' => :view_vulnerability } },
    { path: 'api/vulnerability/v1/report/abc-123', permissions: { 'GET' => :view_vulnerability } },
    # Vulnerability - cves_without_errata (GET + PATCH)
    { path: 'api/vulnerability/v1/feature/cves_without_errata', permissions: { 'GET' => :view_vulnerability, 'PATCH' => :edit_vulnerability } },
    # Vulnerability - catch-all (GET with tags)
    { path: 'api/vulnerability/v1/dashbar', permissions: { 'GET' => :view_vulnerability } },
    { path: 'api/vulnerability/v1/cves/CVE-2024-1234/affected_systems', permissions: { 'GET' => :view_vulnerability } },
    # Advisor - ack (POST/DELETE)
    { path: 'api/insights/v1/ack/', permissions: { 'POST' => :edit_advisor, 'DELETE' => :edit_advisor } },
    { path: 'api/insights/v1/ack/rule_id', permissions: { 'POST' => :edit_advisor, 'DELETE' => :edit_advisor } },
    # Advisor - hostack (POST/DELETE)
    { path: 'api/insights/v1/hostack/', permissions: { 'POST' => :edit_advisor, 'DELETE' => :edit_advisor } },
    { path: 'api/insights/v1/hostack/123', permissions: { 'POST' => :edit_advisor, 'DELETE' => :edit_advisor } },
    # Advisor - unack_hosts (POST)
    { path: 'api/insights/v1/rule/test_rule/unack_hosts', permissions: { 'POST' => :edit_advisor } },
    # Advisor - catch-all (GET)
    { path: 'api/insights/v1/stats/systems', permissions: { 'GET' => :view_advisor } },
    # Unmapped paths (no pattern matches at all)
    { path: 'api/unknown/endpoint', permissions: {} },
    { path: 'api/inventory/v1/system_profile/operating_system', permissions: {} },
    { path: 'api/tasks/v1/some_task', permissions: {} },
  ].freeze

  PERMISSION_MAPPINGS.each do |mapping|
    HTTP_METHODS.each do |http_method|
      expected_permission = mapping[:permissions][http_method]

      if expected_permission
        test "#{http_method} #{mapping[:path]} enforces #{Array(expected_permission).join(', ')}" do
          req = build_request(method: http_method, uri: "/#{mapping[:path]}")
          Array(expected_permission).each { |perm| @user.stubs(:can?).with(perm).returns(false) }

          assert_raises(::Foreman::PermissionMissingException) do
            @forwarder.forward_request(req, mapping[:path], 'test_controller', @user, @organization, @location)
          end
        end
      else
        test "#{http_method} #{mapping[:path]} is rejected as unmapped operation" do
          req = build_request(method: http_method, uri: "/#{mapping[:path]}")
          @forwarder.expects(:execute_cloud_request).never

          assert_raises(::ForemanRhCloud::InsightsApiForwarder::UnsupportedOperationError) do
            @forwarder.forward_request(req, mapping[:path], 'test_controller', @user, @organization, @location)
          end
        end
      end
    end
  end
end
