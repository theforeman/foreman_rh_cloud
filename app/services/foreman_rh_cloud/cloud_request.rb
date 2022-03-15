module ForemanRhCloud
  module CloudRequest
    extend ActiveSupport::Concern

    def execute_cloud_request(params)
      final_params = {
        verify_ssl: ForemanRhCloud.verify_ssl_method,
        proxy: ForemanRhCloud.transformed_http_proxy_string(logger: logger),
      }.deep_merge(params)

      response = RestClient::Request.execute(final_params)

      logger.debug("Response headers for request url #{final_params[:url]} are: #{response.headers}")

      response

    rescue RestClient::Exception => ex
      logger.debug("Failed response with code #{ex.http_code} headers for request url #{final_params[:url]} are: #{ex.http_headers} and body: #{ex.http_body}")
      raise ex
    end
  end
end
