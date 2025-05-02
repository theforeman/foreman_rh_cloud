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
    rescue RestClient::Exceptions::Timeout => ex
      logger.debug("Timeout exception raised for request url #{final_params[:url]}: #{ex}")
      raise ex
    rescue RestClient::ExceptionWithResponse => ex
      logger.debug("Response headers for request url #{final_params[:url]} with status code #{ex.http_code} are: #{ex.http_headers} and body: #{ex.http_body}")
      raise ex
    rescue StandardError => ex
      logger.debug("Exception raised for request url #{final_params[:url]}: #{ex}")
      raise ex
    end
  end
end
