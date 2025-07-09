require 'rest-client'

module ForemanRhCloud
  class InsightsApiForwarder
    include ForemanRhCloud::GatewayRequest

    SCOPED_REQUESTS = [
      %r{/api/vulnerability/v1/vulnerabilities/cves},
      %r{/api/vulnerability/v1/dashbar},
      %r{/api/vulnerability/v1/cves/[^/]+/affected_systems},
      %r{/api/vulnerability/v1/systems/[^/]+/cves},
      %r{/api/insights/.*},
      %r{/api/inventory/.*},
      %r{/api/tasks/.*},
    ].freeze

    def forward_request(original_request, path, controller_name, user, organization, location)
      TagsAuth.new(user, organization, location, logger).update_tag if scope_request?(original_request, path)

      forward_params = prepare_forward_params(original_request, path, user: user, organization: organization, location: location).to_a
      logger.debug("Request parameters for UI request: #{forward_params}")

      forward_payload = prepare_forward_payload(original_request, controller_name)

      logger.debug("User agent for UI is: #{http_user_agent(original_request)}")

      request_opts = prepare_request_opts(original_request, path, forward_payload, forward_params)

      logger.debug("Sending request to: #{request_opts[:url]}")

      execute_cloud_request(request_opts)
    end

    def prepare_tags(user, organization, location)
      [
        TagsAuth.auth_tag_for(user, organization, location),
      ].map { |tag_value| [:tag, tag_value] }
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

      forward_params += prepare_tags(user, organization, location) if scope_request?(original_request, path)

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
      return false unless original_request.get?

      SCOPED_REQUESTS.any? { |request_pattern| request_pattern.match?(path) }
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
  end
end
