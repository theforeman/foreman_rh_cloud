require 'rest-client'

module ForemanRhCloud
  class InsightsApiForwarder
    include ForemanRhCloud::CertAuth

    class UnsupportedOperationError < StandardError
    end

    # Permission mapping for API paths:
    #
    # Foreman Permission   | Paths
    # ---------------------|--------------------------------------------------
    # view_compliance      | GET /api/inventory/v1/hosts(/*)
    # view_compliance      | GET /api/compliance/v2/systems
    # view_compliance      | GET /api/compliance/v2/systems/{system_id}
    # view_compliance      | GET /api/compliance/v2/systems/os_versions
    # view_compliance      | GET /api/compliance/v2/systems/{system_id}/policies
    # view_compliance      | GET /api/compliance/v2/systems/{system_id}/reports
    # view_compliance      | GET /api/compliance/v2/reports/{report_id}/systems
    # view_compliance      | GET /api/compliance/v2/reports/{report_id}/systems/{system_id}
    # view_compliance      | GET /api/compliance/v2/reports/{report_id}/systems/os_versions
    # view_compliance      | GET /api/compliance/v2/policies/{policy_id}/systems/os_versions
    # view_compliance      | GET /api/compliance/v2/*
    # edit_compliance      | POST /api/compliance/v2/policies
    # edit_compliance      | DELETE /api/compliance/v2/policies/{policy_id}
    # edit_compliance      | PATCH /api/compliance/v2/policies/{policy_id}
    # edit_compliance      | POST /api/compliance/v2/policies/{policy_id}/systems
    # edit_compliance      | DELETE /api/compliance/v2/policies/{policy_id}/systems/{system_id}
    # edit_compliance      | PATCH /api/compliance/v2/policies/{policy_id}/systems/{system_id}
    # edit_compliance      | POST /api/compliance/v2/policies/{policy_id}/tailorings
    # edit_compliance      | PATCH /api/compliance/v2/policies/{policy_id}/tailorings/{tailoring_id}
    # edit_compliance      | POST /api/compliance/v2/policies/{policy_id}/tailorings/{tailoring_id}/rules
    # edit_compliance      | DELETE /api/compliance/v2/policies/{policy_id}/tailorings/{tailoring_id}/rules/{rule_id}
    # edit_compliance      | PATCH /api/compliance/v2/policies/{policy_id}/tailorings/{tailoring_id}/rules/{rule_id}
    # edit_compliance      | DELETE /api/compliance/v2/reports/{report_id}
    #
    # view_vulnerability   | GET /api/inventory/v1/hosts(/*)
    # view_vulnerability   | GET /api/vulnerability/v1/*
    #                      | POST /api/vulnerability/v1/vulnerabilities/cves
    # edit_vulnerability   | PATCH /api/vulnerability/v1/status
    # edit_vulnerability   | PATCH /api/vulnerability/v1/cves/status
    #                      | PATCH /api/vulnerability/v1/cves/business_risk
    # edit_vulnerability   | PATCH /api/vulnerability/v1/systems/opt_out
    #                      | PATCH /api/vulnerability/v1/feature/cves_without_errata
    #
    # view_advisor         | GET /api/insights/v1/*
    # edit_advisor         | POST /api/insights/v1/ack/
    #                      | PUT /api/insights/v1/ack/{rule_id}/
    #                      | DELETE /api/insights/v1/ack/{rule_id}/
    #                      | POST /api/insights/v1/hostack/
    #                      | PUT /api/insights/v1/hostack/{id}/
    #                      | DELETE /api/insights/v1/hostack/{id}/
    #                      | POST /api/insights/v1/rule/{rule_id}/ack_hosts/
    #                      | POST /api/insights/v1/rule/{rule_id}/unack_hosts/
    #
    SCOPED_REQUESTS = [
      # Inventory hosts - shared dependency;
      #                 - requires view_advisor, view_compliance, or view_vulnerability for GET
      {
        test: %r{api/inventory/v1/hosts(/.*)?$},
        tag_name: :tags,
        permissions: {
          'GET' => [:view_advisor, :view_compliance, :view_vulnerability],
        },
      },
      # Policies - requires view_compliance for GET, edit_compliance for POST/DELETE/PATCH
      {
        test: %r{api/compliance/v2/policies(/[^/]*)?$},
        permissions: {
          'GET' => :view_compliance,
          'POST' => :edit_compliance,
          'DELETE' => :edit_compliance,
          'PATCH' => :edit_compliance,
        },
      },
      # System and policies assigned to them - requires view_compliance for GET, edit_compliance for POST/DELETE/PATCH
      {
        test: %r{api/compliance/v2/policies/[^/]+/systems(/[^/]*)?$},
        tag_name: :tags,
        permissions: {
          'GET' => :view_compliance,
          'POST' => :edit_compliance,
          'DELETE' => :edit_compliance,
          'PATCH' => :edit_compliance,
        },
      },
      # Tailorings of assigned policies - requires view_compliance for GET, edit_compliance for POST/PATCH
      {
        test: %r{api/compliance/v2/policies/[^/]+/tailorings(/[^/]*)?$},
        permissions: {
          'GET' => :view_compliance,
          'POST' => :edit_compliance,
          'PATCH' => :edit_compliance,
        },
      },
      # Rules of Tailorings - requires view_compliance for GET, edit_compliance for POST/DELETE/PATCH
      {
        test: %r{api/compliance/v2/policies/[^/]+/tailorings/[^/]+/rules(/[^/]*)?$},
        permissions: {
          'GET' => :view_compliance,
          'POST' => :edit_compliance,
          'DELETE' => :edit_compliance,
          'PATCH' => :edit_compliance,
        },
      },
      # Compliance Reports - requires view_compliance for GET, edit_compliance for DELETE
      {
        test: %r{api/compliance/v2/reports(/[^/]*)?$},
        permissions: {
          'GET' => :view_compliance,
          'DELETE' => :edit_compliance,
        },
      },
      # Systems assigned to a report - requires view_compliance for GET
      {
        test: %r{api/compliance/v2/reports/[^/]+/systems$},
        tag_name: :tags,
        permissions: {
          'GET' => :view_compliance,
        },
      },
      # Individual system in a report - requires view_compliance for GET
      {
        test: %r{api/compliance/v2/reports/[^/]+/systems/[^/]+$},
        tag_name: :tags,
        permissions: {
          'GET' => :view_compliance,
        },
      },
      # OS versions for systems in a report - requires view_compliance for GET
      {
        test: %r{api/compliance/v2/reports/[^/]+/systems/os_versions$},
        tag_name: :tags,
        permissions: {
          'GET' => :view_compliance,
        },
      },
      # OS versions for systems in a policy - requires view_compliance for GET
      {
        test: %r{api/compliance/v2/policies/[^/]+/systems/os_versions$},
        tag_name: :tags,
        permissions: {
          'GET' => :view_compliance,
        },
      },
      # Compliance Systems list - requires view_compliance for GET
      {
        test: %r{api/compliance/v2/systems$},
        tag_name: :tags,
        permissions: {
          'GET' => :view_compliance,
        },
      },
      # Individual compliance system - requires view_compliance for GET
      {
        test: %r{api/compliance/v2/systems/[^/]+$},
        tag_name: :tags,
        permissions: {
          'GET' => :view_compliance,
        },
      },
      # OS versions for all systems - requires view_compliance for GET
      {
        test: %r{api/compliance/v2/systems/os_versions$},
        tag_name: :tags,
        permissions: {
          'GET' => :view_compliance,
        },
      },
      # Policies for a specific system - requires view_compliance for GET
      {
        test: %r{api/compliance/v2/systems/[^/]+/policies$},
        tag_name: :tags,
        permissions: {
          'GET' => :view_compliance,
        },
      },
      # Reports for a specific system - requires view_compliance for GET
      {
        test: %r{api/compliance/v2/systems/[^/]+/reports$},
        tag_name: :tags,
        permissions: {
          'GET' => :view_compliance,
        },
      },
      # Test results for a report - requires view_compliance for GET
      {
        test: %r{api/compliance/v2/reports/[^/]+/test_results$},
        tag_name: :tags,
        permissions: {
          'GET' => :view_compliance,
        },
      },
      # Individual test result in a report - requires view_compliance for GET
      {
        test: %r{api/compliance/v2/reports/[^/]+/test_results/[^/]+$},
        tag_name: :tags,
        permissions: {
          'GET' => :view_compliance,
        },
      },
      # Other compliance endpoints - GET requires view_compliance
      {
        test: %r{api/compliance/v2/.*},
        permissions: {
          'GET' => :view_compliance,
        },
      },
      # Vulnerability CVEs list and IDs - GET/POST require view_vulnerability (no tags support per OpenAPI spec)
      {
        test: %r{api/vulnerability/v1/vulnerabilities/cves(/ids)?$},
        permissions: {
          'GET' => :view_vulnerability,
          'POST' => :view_vulnerability,
        },
      },
      # Vulnerability status - GET requires view_vulnerability, PATCH requires edit_vulnerability
      # Note: GET /status does not support tags parameter per OpenAPI spec
      {
        test: %r{api/vulnerability/v1/status},
        permissions: {
          'GET' => :view_vulnerability,
          'PATCH' => :edit_vulnerability,
        },
      },
      # CVE status - PATCH requires edit_vulnerability (no GET endpoint)
      {
        test: %r{api/vulnerability/v1/cves/status},
        permissions: {
          'PATCH' => :edit_vulnerability,
        },
      },
      # CVE business risk - PATCH requires edit_vulnerability (no GET endpoint)
      {
        test: %r{api/vulnerability/v1/cves/business_risk},
        permissions: {
          'PATCH' => :edit_vulnerability,
        },
      },
      # Systems opt out - PATCH requires edit_vulnerability (no GET endpoint)
      {
        test: %r{api/vulnerability/v1/systems/opt_out},
        permissions: {
          'PATCH' => :edit_vulnerability,
        },
      },
      # Endpoints without tags support (per OpenAPI spec) - still require view_vulnerability for GET
      {
        test: %r{api/vulnerability/v1/(apistatus|version|business_risk|announcement)$},
        permissions: {
          'GET' => :view_vulnerability,
        },
      },
      {
        test: %r{api/vulnerability/v1/cves/[^/]+$},
        permissions: {
          'GET' => :view_vulnerability,
        },
      },
      {
        test: %r{api/vulnerability/v1/(playbooks|report)/},
        permissions: {
          'GET' => :view_vulnerability,
        },
      },
      # CVEs without errata feature flag - no tags support (per OpenAPI spec)
      {
        test: %r{api/vulnerability/v1/feature/cves_without_errata$},
        permissions: {
          'GET' => :view_vulnerability,
          'PATCH' => :edit_vulnerability,
        },
      },
      # Other vulnerability endpoints - GET requires view_vulnerability (with tags support)
      {
        test: %r{api/vulnerability/v1/.*},
        tag_name: :tags,
        permissions: {
          'GET' => :view_vulnerability,
        },
      },
      # Advisor ack endpoints - GET requires view_advisor, POST/PUT/DELETE require edit_advisor
      {
        test: %r{api/insights/v1/ack(/[^/]*)?/?$},
        tag_name: :tags,
        permissions: {
          'GET' => :view_advisor,
          'POST' => :edit_advisor,
          'PUT' => :edit_advisor,
          'DELETE' => :edit_advisor,
        },
      },
      # Advisor hostack endpoints - GET requires view_advisor, POST/PUT/DELETE require edit_advisor
      {
        test: %r{api/insights/v1/hostack(/[^/]*)?/?$},
        tag_name: :tags,
        permissions: {
          'GET' => :view_advisor,
          'POST' => :edit_advisor,
          'PUT' => :edit_advisor,
          'DELETE' => :edit_advisor,
        },
      },
      # Advisor rule ack_hosts - POST requires edit_advisor
      {
        test: %r{api/insights/v1/rule/[^/]+/ack_hosts},
        tag_name: :tags,
        permissions: {
          'POST' => :edit_advisor,
        },
      },
      # Advisor rule unack_hosts - POST requires edit_advisor
      {
        test: %r{api/insights/v1/rule/[^/]+/unack_hosts},
        tag_name: :tags,
        permissions: {
          'POST' => :edit_advisor,
        },
      },
      # Other Advisor/Insights endpoints - GET requires view_advisor
      {
        test: %r{api/insights/v1/.*},
        tag_name: :tags,
        permissions: {
          'GET' => :view_advisor,
        },
      },
    ].freeze

    def forward_request(original_request, path, controller_name, user, organization, location)
      http_method = original_request.request_method
      pattern = resolve_pattern(path)
      permissions = pattern&.dig(:permissions, http_method)

      # Deny-by-default: reject if no matching pattern or no permission mapping for this HTTP method
      unless permissions
        logger.warn("Unmapped operation: #{http_method} #{path}")
        raise UnsupportedOperationError.new(N_("This operation is not supported"))
      end

      # Check user has the required permission(s)
      if Array(permissions).none? { |p| user&.can?(p) }
        logger.warn("User #{user&.login || 'anonymous'} lacks permissions #{Array(permissions).join(', ')} for #{http_method} #{path}")
        raise ::Foreman::PermissionMissingException.new(N_("You do not have permission to perform this action"))
      end

      TagsAuth.new(user, organization, location, logger).update_tag if scope_request?(original_request, path)

      forward_params = prepare_forward_params(original_request, path, user: user, organization: organization, location: location).to_a
      logger.debug("Request parameters for UI request: #{forward_params}")

      forward_payload = prepare_forward_payload(original_request, controller_name)

      logger.debug("User agent for UI is: #{http_user_agent(original_request)}")

      request_opts = prepare_request_opts(original_request, path, forward_payload, forward_params)

      request_opts[:organization] = organization

      logger.debug("Sending request to: #{request_opts[:url]}")

      execute_cloud_request(request_opts)
    end

    def prepare_tags(user, organization, location, tag_name)
      [
        TagsAuth.auth_tag_for(user, organization, location),
      ].map { |tag_value| [tag_name, tag_value] }
    end

    def prepare_request_opts(original_request, path, forward_payload, forward_params)
      base_params = {
        method: original_request.method,
        payload: forward_payload,
        headers: original_headers(original_request).merge(
          {
            params: RestClient::ParamsArray.new(forward_params),
            user_agent: http_user_agent(original_request),
            content_type: original_request.media_type.presence || original_request.format.to_s,
          }
        ),
      }
      params = path_params(path)

      base_params.merge(params)
    end

    def prepare_forward_payload(original_request, controller_name)
      forward_payload = original_request.request_parameters[controller_name]

      forward_payload = original_request.raw_post.clone if (original_request.post? || original_request.patch?) && original_request.raw_post
      forward_payload = original_request.body.read if original_request.put?

      forward_payload = original_request.params.slice(:file, :metadata) if original_request.params[:file]

      # fix rails behaviour for http PATCH:
      forward_payload = forward_payload.to_json if original_request.format.json? && original_request.patch? && forward_payload && !forward_payload.is_a?(String)
      forward_payload
    end

    def prepare_forward_params(original_request, path, user:, organization:, location:)
      forward_params = original_request.query_parameters.to_a

      tag_name = scope_request?(original_request, path)
      forward_params += prepare_tags(user, organization, location, tag_name) if tag_name

      forward_params
    end

    def path_params(path)
      {
        url: "#{InsightsCloud.ui_base_url}/#{path}",
      }
    end

    def original_headers(original_request)
      headers = {
        if_none_match: original_request.if_none_match,
        if_modified_since: original_request.if_modified_since,
      }.compact

      logger.debug("Sending headers: #{headers}")
      headers
    end

    def scope_request?(original_request, path)
      return nil unless original_request.get?

      resolve_pattern(path)&.[](:tag_name)
    end

    def core_app_name
      BranchInfo.new.core_app_name
    end

    def core_app_version
      BranchInfo.new.core_app_version
    end

    def http_user_agent(original_request)
      "#{core_app_name}/#{core_app_version};#{ForemanRhCloud::Engine.engine_name}/#{ForemanRhCloud::VERSION};#{original_request.env['HTTP_USER_AGENT']}"
    end

    def logger
      Foreman::Logging.logger('app')
    end

    # Resolves the most specific SCOPED_REQUESTS pattern matching the given path.
    # When multiple patterns match, chooses the one with the longest regex source
    # as a proxy for specificity.
    # @param path [String] The request path
    # @return [Hash, nil] The matching pattern hash, or nil if no pattern matches
    def resolve_pattern(path)
      matching = SCOPED_REQUESTS.select { |p| p[:test].match?(path) }
      return nil if matching.empty?

      matching.max_by { |p| p[:test].source.length }
    end

    # Returns the required permission for the given path and HTTP method.
    # @param path [String] The request path
    # @param http_method [String] The HTTP method (GET, POST, etc.)
    # @return [Symbol, Array<Symbol>] The required permission(s)
    # @return [nil] No matching pattern or method not listed in the pattern's permissions
    def required_permission_for(path, http_method)
      resolve_pattern(path)&.dig(:permissions, http_method)
    end
  end
end
