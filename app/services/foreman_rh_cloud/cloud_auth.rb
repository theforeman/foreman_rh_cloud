module ForemanRhCloud
  module CloudAuth
    extend ActiveSupport::Concern

    include CloudRequest

    def cloud_auth_available?
      Setting[:rh_cloud_token].present?
    end

    def rh_credentials
      @rh_credentials ||= query_refresh_token
    end

    def query_refresh_token
      token_response = RestClient::Request.execute(
        method: :post,
        url: ForemanRhCloud.authentication_url,
        verify_ssl: ForemanRhCloud.verify_ssl_method,
        proxy: ForemanRhCloud.transformed_http_proxy_string(logger: logger),
        payload: {
          grant_type: 'refresh_token',
          client_id: 'rhsm-api',
          refresh_token: Setting[:rh_cloud_token],
        }
      )

      JSON.parse(token_response)['access_token']
    rescue RestClient::ExceptionWithResponse => e
      Foreman::Logging.exception('Unable to authenticate using rh_cloud_token setting', e)
      raise ::Foreman::WrappedException.new(e, N_('Unable to authenticate using rh_cloud_token setting'))
    end

    def execute_cloud_request(params)
      final_params = {
        headers: {
          Authorization: "Bearer #{rh_credentials}",
        },
      }.deep_merge(params)

      super(final_params)
    end
  end
end
