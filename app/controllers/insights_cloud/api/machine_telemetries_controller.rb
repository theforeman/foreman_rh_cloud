module InsightsCloud::Api
  class MachineTelemetriesController < ::Api::V2::BaseController
    layout false

    include ::InsightsCloud::ClientAuthentication
    include ::InsightsCloud::CandlepinCache

    before_action :ensure_telemetry_enabled_for_consumer, :only => [:forward_request]
    before_action :cert_uuid, :ensure_org, :ensure_branch_id, :only => [:forward_request]
    skip_after_action :log_response_body, :only => [:forward_request]
    skip_before_action :check_media_type, :only => [:forward_request]

    # The method that "proxies" requests over to Cloud
    def forward_request
      cloud_response = ::ForemanRhCloud::CloudRequestForwarder.new.forward_request(request, controller_name, @branch_id)

      if cloud_response.code == 401
        return render json: {
          :message => 'Authentication to the Insights Service failed.',
          :headers => {}
        }, status: 502
      end

      if cloud_response.headers[:content_disposition]
        return send_data cloud_response, disposition: cloud_response.headers[:content_disposition], type: cloud_response.headers[:content_type]
      end

      assign_header(response, cloud_response, :x_resource_count, true)
      assign_header(response, cloud_response, :x_rh_insights_request_id, false)

      render json: cloud_response, status: cloud_response.code
    end

    def assign_header(res, cloud_res, header, transform)
      header_content = cloud_res.headers[header]
      return unless header_content
      new_header = transform ? header.to_s.gsub('_', '-') : header.to_s
      res.headers[new_header] = header_content
    end

    def ensure_telemetry_enabled_for_consumer
      render_message 'Telemetry is not enabled for your organization', :status => 403 if Setting[:rh_cloud_disable_insights_proxy]
    end

    private

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
  end
end
