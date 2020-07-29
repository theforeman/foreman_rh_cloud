module InsightsCloud
  class TasksController < ::ApplicationController
    def create
      selected_org = Organization.current
      host_statuses = InsightsCloud::Async::InsightsFullSync.perform_now(selected_org)

      render json: {
        syncHosts: host_statuses.syncHosts,
        disconnectHosts: host_statuses.disconnectHosts,
      }, status: :ok
    end
  end
end
