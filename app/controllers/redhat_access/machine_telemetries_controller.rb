module RedhatAccess
  class MachineTelemetriesController < ::Api::V2::BaseController
    layout false

    include ::RedhatAccess::ClientAuthentication
    include ::RedhatAccess::CandlepinRelated

    before_action :cert_uuid, :ensure_org, :ensure_branch_id, :only => [:branch_info]

    def branch_info
      render :json => ForemanRhCloud::BranchInfo.new.generate(@uuid, @host, @branch_id, request.host).to_json
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
