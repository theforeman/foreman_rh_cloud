module ForemanInventoryUpload
  class TasksController < ::ApplicationController
    def create
      selected_org = Organization.current
      host_statuses = InventorySync::Async::InventoryFullSync.perform_now(selected_org)

      render json: {
        syncHosts: host_statuses[:sync],
        disconnectHosts: host_statuses[:disconnect],
      }, status: :ok
    end
  end
end
