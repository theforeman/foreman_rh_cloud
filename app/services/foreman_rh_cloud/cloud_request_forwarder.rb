require 'rest-client'

module ForemanRhCloud
  class CloudRequestForwarder
    include ::ForemanRhCloud::CloudAuth

    def forward_request(original_request, controller_name, branch_id, certs)
      forward_params = prepare_forward_params(original_request, branch_id)
      logger.debug("Request parameters for telemetry request: #{forward_params}")

      forward_payload = prepare_forward_payload(original_request, controller_name)

      logger.debug("User agent for telemetry is: #{http_user_agent original_request}")

      request_opts = prepare_request_opts(original_request, forward_payload, forward_params, certs)

      logger.debug("Sending request to: #{request_opts[:url]}")

      execute_cloud_request(request_opts)
    end

    def prepare_request_opts(original_request, forward_payload, forward_params, certs)
      base_params = {
        method: original_request.method,
        verify_ssl: ForemanRhCloud.verify_ssl_method,
        payload: forward_payload,
        headers: {
          params: forward_params,
        },
      }

      if no_cert_paths.any? { |path| path.match original_request.path }
        base_params.merge(url: prepare_forward_cloud_url(ForemanRhCloud.base_url, original_request.path))
      else
        base_params.merge(
          url: prepare_forward_cloud_url(ForemanRhCloud.cert_base_url, original_request.path),
          ssl_client_cert: OpenSSL::X509::Certificate.new(certs[:cert]),
          ssl_client_key: OpenSSL::PKey::RSA.new(certs[:key])
        )
      end
    end

    def no_cert_paths
      [
        "/redhat_access/r/insights/v1/static/release/insights-core.egg",
        "/redhat_access/r/insights/v1/static/uploader.v2.json",
        "/redhat_access/r/insights/v1/static/uploader.v2.json.asc",
        "/redhat_access/r/insights/v1/static/core/insights-core.egg",
      ]
    end

    def execute_cloud_request(request_opts)
      RestClient::Request.execute request_opts
    end

    def prepare_forward_payload(original_request, controller_name)
      forward_payload = original_request.request_parameters[controller_name]

      forward_payload = original_request.raw_post.clone if original_request.post? && original_request.raw_post
      forward_payload = original_request.body.read if original_request.put?

      forward_payload = original_request.params.slice(:file, :metadata) if original_request.params[:file]

      # fix rails behaviour for http PATCH:
      forward_payload = forward_payload.to_json if original_request.format.json? && original_request.patch? && forward_payload && !forward_payload.is_a?(String)
      forward_payload
    end

    def prepare_forward_params(original_request, branch_id)
      forward_params = original_request.query_parameters
      if original_request.user_agent && !original_request.user_agent.include?('redhat_access_cfme')
        forward_params = forward_params.merge(:branch_id => branch_id)
      end

      forward_params
    end

    def prepare_forward_cloud_url(base_url, request_path)
      cloud_path = request_path.sub('/redhat_access/r/insights/platform/', '')
                               .sub('/redhat_access/r/insights/', '')

      "#{base_url}/api/#{cloud_path}"
    end

    def core_app_name
      'Foreman'
    end

    def core_app_version
      Foreman::Version.new
    end

    def http_user_agent(original_request)
      "#{core_app_name}/#{core_app_version};#{ForemanRhCloud::Engine.engine_name}/#{ForemanRhCloud::VERSION};#{original_request.env['HTTP_USER_AGENT']}"
    end

    def logger
      Foreman::Logging.logger('app')
    end
  end
end
