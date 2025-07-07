module InsightsCloud
  class UIRequestsController < ::ApplicationController
    layout false

    before_action :ensure_org, :ensure_loc, :only => [:forward_request]

    # The method that "proxies" requests over to Cloud
    def forward_request
      begin
        @cloud_response = ::ForemanRhCloud::InsightsApiForwarder.new.forward_request(
          request,
          params.require(:path),
          controller_name,
          User.current,
          @organization,
          @location
        )
      rescue RestClient::Exceptions::Timeout => e
        response_obj = e.response.presence || e.exception
        return render json: { message: response_obj.to_s, error: response_obj.to_s }, status: :gateway_timeout
      rescue RestClient::Unauthorized => e
        logger.warn("Forwarding request auth error: #{e}")
        message = 'Authentication to the Insights Service failed.'
        return render json: { message: message, error: message }, status: :unauthorized
      rescue RestClient::NotModified => e
        logger.info("Forwarding request not modified: #{e}")
        message = 'Cloud request not modified'
        return render json: { message: message, error: message }, status: :not_modified
      rescue RestClient::ExceptionWithResponse => e
        response_obj = e.response.presence || e.exception
        code = response_obj.try(:code) || response_obj.try(:http_code) || 500
        message = 'Cloud request failed'

        return render json: {
          :message => message,
          :error => response_obj.to_s,
          :headers => {},
          :response => response_obj,
        }, status: code
      rescue StandardError => e
        # Catch any other exceptions here, such as Errno::ECONNREFUSED
        logger.warn("Cloud request failed with exception: #{e}")
        return render json: { error: e.to_s }, status: :bad_gateway
      end

      # Append redhat-specific headers
      @cloud_response.headers.each do |key, _value|
        assign_header(response, @cloud_response, key, false) if key.to_s.start_with?('x_rh_')
      end

      # Append general headers
      assign_header(response, @cloud_response, :x_resource_count, true)
      headers[Rack::ETAG] = @cloud_response.headers[:etag]

      if @cloud_response.headers[:content_disposition]
        # If there is a Content-Disposition header, it means we are forwarding binary data, send the raw data with proper
        # content type
        send_data @cloud_response, disposition: @cloud_response.headers[:content_disposition], type: @cloud_response.headers[:content_type]
      elsif @cloud_response.headers[:content_type] =~ /zip/
        # If there is no Content-Disposition, but the content type is binary according to Content-Type, send the raw data
        # with proper content type
        send_data @cloud_response, type: @cloud_response.headers[:content_type]
      else
        render json: @cloud_response, status: @cloud_response.code
      end
    end

    def assign_header(res, cloud_res, header, transform)
      header_content = cloud_res.headers[header]
      return unless header_content
      new_header = transform ? header.to_s.tr('_', '-') : header.to_s
      res.headers[new_header] = header_content
    end

    private

    def ensure_org
      @organization = Organization.current
      return render_message 'Organization not found or invalid', :status => 400 unless @organization
    end

    def ensure_loc
      @location = Location.current
      return render_message 'Location not found or invalid', :status => 400 unless @location
    end

    def base_url
      InsightsCloud.ui_base_url
    end

    def render_message(msg, render_options = {})
      render_options[:json] = { :message => msg }
      render render_options
    end
  end
end
