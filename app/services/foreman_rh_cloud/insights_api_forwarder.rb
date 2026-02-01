require 'rest-client'

module ForemanRhCloud
  class InsightsApiForwarder
    include ForemanRhCloud::CertAuth

    # Permission mapping for API paths:
    #
    # Foreman Permission   | Paths
    # ---------------------|--------------------------------------------------
    # view_vulnerability   | GET /api/inventory/v1/hosts(/*)
    # view_vulnerability   | GET /api/vulnerability/v1/*
    #                      | POST /api/vulnerability/v1/vulnerabilities/cves
    # edit_vulnerability   | PATCH /api/vulnerability/v1/status
    # edit_vulnerability   | PATCH /api/vulnerability/v1/cves/status
    #                      | PATCH /api/vulnerability/v1/cves/business_risk
    # edit_vulnerability   | PATCH /api/vulnerability/v1/systems/opt_out
    #
    # view_advisor         | GET /api/insights/v1/*
    # edit_advisor         | POST /api/insights/v1/ack/
    #                      | DELETE /api/insights/v1/ack/{rule_id}/
    #                      | POST /api/insights/v1/hostack/
    #                      | DELETE /api/insights/v1/hostack/{id}/
    #                      | POST /api/insights/v1/rule/{rule_id}/unack_hosts/
    #
    SCOPED_REQUESTS = [
      # Inventory hosts - requires view_vulnerability for GET
      {
        test: %r{api/inventory/v1/hosts(/.*)?$},
        tag_name: :tags,
        permissions: {
          'GET' => :view_vulnerability,
        },
      },
      # Vulnerability CVEs list - POST requires view_vulnerability (no tags support per OpenAPI spec)
      {
        test: %r{api/vulnerability/v1/vulnerabilities/cves},
        permissions: {
          'POST' => :view_vulnerability,
        },
      },
      # Vulnerability status - PATCH requires edit_vulnerability
      # Note: GET /status does not support tags parameter per OpenAPI spec
      {
        test: %r{api/vulnerability/v1/status},
        permissions: {
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
      # Other vulnerability endpoints - GET requires view_vulnerability (with tags support)
      {
        test: %r{api/vulnerability/v1/.*},
        tag_name: :tags,
        permissions: {
          'GET' => :view_vulnerability,
        },
      },
      # Advisor ack endpoints - POST/DELETE require edit_advisor
      {
        test: %r{api/insights/v1/ack(/[^/]*)?$},
        tag_name: :tags,
        permissions: {
          'POST' => :edit_advisor,
          'DELETE' => :edit_advisor,
        },
      },
      # Advisor hostack endpoints - POST/DELETE require edit_advisor
      {
        test: %r{api/insights/v1/hostack(/[^/]*)?$},
        tag_name: :tags,
        permissions: {
          'POST' => :edit_advisor,
          'DELETE' => :edit_advisor,
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
      # Other API endpoints (tagging only, no permission enforcement)
      { test: %r{api/inventory/.*}, tag_name: :tags },
      { test: %r{api/tasks/.*}, tag_name: :tags },
    ].freeze

    def forward_request(original_request, path, controller_name, user, organization, location)
      # Check permissions before forwarding
      permission = required_permission_for(path, original_request.request_method)
      if permission && !user&.can?(permission)
        logger.warn("User #{user&.login || 'anonymous'} lacks permission #{permission} for #{original_request.request_method} #{path}")
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

      request_pattern = SCOPED_REQUESTS.find { |pattern| pattern[:test].match?(path) }
      request_pattern[:tag_name] if request_pattern
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

    # Returns the required permission for the given path and HTTP method
    # Resolves overlapping patterns by choosing the most specific matcher,
    # defined as the one with the longest regex source that matches the path.
    # This avoids permission changes caused by reordering SCOPED_REQUESTS.
    # @param path [String] The request path
    # @param http_method [String] The HTTP method (GET, POST, etc.)
    # @return [Symbol, nil] The required permission symbol or nil if no permission required
    def required_permission_for(path, http_method)
      # Collect all matching patterns
      matching_patterns = SCOPED_REQUESTS.select { |pattern| pattern[:test].match?(path) }
      return nil if matching_patterns.empty?

      # Choose the most specific pattern: longest regex source wins.
      # This makes overlapping patterns deterministic and independent of array order.
      request_pattern = matching_patterns.max_by { |pattern| pattern[:test].source.length }

      permissions = request_pattern[:permissions]
      return nil unless permissions

      permissions[http_method]
    end
  end
end
