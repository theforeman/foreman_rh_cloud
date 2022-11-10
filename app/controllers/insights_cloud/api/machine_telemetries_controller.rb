module InsightsCloud::Api
  class MachineTelemetriesController < ::Api::V2::BaseController
    layout false

    include ::InsightsCloud::ClientAuthentication
    include ::InsightsCloud::CandlepinCache

    before_action :set_admin_user, only: [:forward_request]
    before_action :cert_uuid, :ensure_org, :ensure_branch_id, :only => [:forward_request, :branch_info]
    before_action :ensure_telemetry_enabled_for_consumer, :only => [:forward_request]

    skip_after_action :log_response_body, :only => [:forward_request]
    skip_before_action :check_media_type, :only => [:forward_request]
    after_action :update_host_insights_status, only: [:forward_request]

    # The method that "proxies" requests over to Cloud
    def forward_request
      certs = candlepin_id_cert @organization
      @cloud_response = ::ForemanRhCloud::CloudRequestForwarder.new.forward_request(request, controller_name, @branch_id, certs)

      if @cloud_response.code == 401
        return render json: {
          :message => 'Authentication to the Insights Service failed.',
          :headers => {},
        }, status: :bad_gateway
      end

      if @cloud_response.code >= 300
        return render json: {
          :message => 'Cloud request failed',
          :headers => {},
          :response => @cloud_response,
        }, status: @cloud_response.code
      end

      # Append redhat-specific headers
      @cloud_response.headers.each do |key, value|
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
        # if there is no Content-Disposition, but the content type is binary according the content type,
        # forward the request as binry too
        send_data @cloud_response, type: @cloud_response.headers[:content_type]
      else
        render json: @cloud_response, status: @cloud_response.code
      end
    end

    def branch_info
      render :json => ForemanRhCloud::BranchInfo.new.generate(@uuid, @host, @branch_id, request.host).to_json
    end

    def assign_header(res, cloud_res, header, transform)
      header_content = cloud_res.headers[header]
      return unless header_content
      new_header = transform ? header.to_s.tr('_', '-') : header.to_s
      res.headers[new_header] = header_content
    end

    private

    def ensure_telemetry_enabled_for_consumer
      unless (config = telemetry_config(@host))
        logger.debug("Rejected telemetry forwarding for host #{@host.name}, insights param is set to: #{config}")
        render_message 'Telemetry is not enabled for this host', :status => 403
      end
      config
    end

    def telemetry_config(host)
      param_value = nil
      User.as_anonymous_admin do
        param_value = host.host_param(InsightsCloud.enable_client_param)
      end
      param_value
    end

    def cert_uuid
      @uuid ||= User.current.login
    end

    def ensure_org
      @organization = @host.organization
      return render_message 'Organization not found or invalid', :status => 400 unless @organization
    end

    def ensure_branch_id
      @branch_id = cp_owner_id(@organization)
      return render_message "Branch ID not found for organization #{@organization.title}", :status => 400 unless @branch_id
    end

    def update_host_insights_status
      return unless request.path == '/redhat_access/r/insights/platform/ingress/v1/upload' ||
                    request.path.include?('/redhat_access/r/insights/uploads/')

      return unless @cloud_response.code.to_s.start_with?('2')

      # create insights status if it wasn't there in the first place and refresh its reporting date
      @host.get_status(InsightsClientReportStatus).refresh!
      @host.refresh_global_status!
    end
  end
end
