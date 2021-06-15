module ForemanRhCloud
  module CloudRequest
    extend ActiveSupport::Concern

    def execute_cloud_request(params)
      final_params = {
        verify_ssl: ForemanRhCloud.verify_ssl_method,
        proxy: ForemanRhCloud.transformed_http_proxy_string(logger: logger),
      }.deep_merge(params)

      RestClient::Request.execute(final_params)
    end
  end
end
