module ForemanInventoryUpload
  class MissingHostsController < ::ApplicationController
    def index
      organizations = Organization.current || User.current.my_organizations
      organization_id = organizations.pluck(:id)
      payload = InsightsMissingHosts.where(organization_id: organization_id)

      render :json => payload
    end

    def remove_hosts
      organization_id = params[:organization_id]
      search_term = params[:search_term]

      task = ForemanTasks.async_task(ForemanInventoryUpload::Async::RemoveInsightsHostsJob, search_term, organization_id)

      render json: {
        task: task,
      }, status: :ok
    end
  end
end
