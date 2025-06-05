require 'rest-client'

module ForemanRhCloud
  class UIRequestForwarder
    include ForemanRhCloud::CloudRequest

    def forward_request(original_request, base_url, controller_name, user, organization, location, certs)
      TagsAuth.new(user, logger).update_tag if scope_request?(original_request)

      forward_params = prepare_forward_params(original_request, user: user, organization: organization, location: location).to_a
      logger.debug("Request parameters for UI request: #{forward_params}")

      forward_payload = prepare_forward_payload(original_request, controller_name)

      logger.debug("User agent for UI is: #{http_user_agent(original_request)}")

      request_opts = prepare_request_opts(original_request, base_url, forward_payload, forward_params, certs)

      logger.debug("Sending request to: #{request_opts[:url]}")

      execute_cloud_request(request_opts)
    end

    def prepare_tags(user, organization, location)
      [
        CGI.escape(TagsAuth.auth_tag_for(user)),
        CGI.escape("satellite/organization=#{organization}"),
        CGI.escape("satellite/location=#{location}"),
      ].map { |tag_value| [:tag, tag_value] }
    end

    def prepare_request_opts(original_request, base_url, forward_payload, forward_params, certs)
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
      requested_url = original_request.original_fullpath.end_with?('/') ? "#{original_request.path}/" : original_request.path
      params = path_params(requested_url, base_url, certs)

      if ForemanRhCloud.with_local_advisor_engine?
        params[:ssl_ca_file] = ForemanRhCloud.ca_cert
      end

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

    def prepare_forward_params(original_request, user:, organization:, location:)
      forward_params = original_request.query_parameters.to_a

      forward_params += prepare_tags(user, organization, location) if scope_request?(original_request)

      forward_params
    end

    def path_params(request_path, base_url, certs)
      {
        url: ForemanRhCloud.cert_base_url + request_path.sub(base_url, '/ui'),
        ssl_client_cert: OpenSSL::X509::Certificate.new(certs[:cert]),
        ssl_client_key: OpenSSL::PKey.read(certs[:key]),
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

    def scope_request?(original_request)
      original_request.get?
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
