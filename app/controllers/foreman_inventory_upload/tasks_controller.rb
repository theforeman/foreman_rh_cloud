module ForemanInventoryUpload
  class TasksController < ::ApplicationController
    include InventoryUpload::TaskActions

    def create
      selected_org = Organization.current

      task = start_inventory_sync(selected_org)

      render json: {
        task: task,
      }, status: :ok
    rescue InventoryUpload::TaskActions::NothingToSyncError => error
        return render json: { message: error.message }, status: :internal_server_error
    end

    def show
      task = ForemanTasks::Task.find_by(id: params[:id])
      return render json: { message: N_('No task was found') }, status: :internal_server_error unless task

      render json: {
        endedAt: task.ended_at,
        output: task.output,
        result: task.result,
      }, status: :ok
    end
  end
end
