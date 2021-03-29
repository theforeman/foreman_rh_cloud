module ForemanInventoryUpload
  class TasksController < ::ApplicationController
    def create
      selected_org = Organization.current
      subscribed_hosts_ids = Set.new(
        ForemanInventoryUpload::Generators::Queries.for_slice(
          Host.unscoped.where(organization: selected_org)
        ).pluck(:id)
      )

      if subscribed_hosts_ids.empty?
        return render json: {
          message: N_('Nothing to sync, there are no hosts with subscription for this organization.'),
        }, status: :method_not_allowed
      else
        task = ForemanTasks.async_task(InventorySync::Async::InventoryFullSync, selected_org)
      end
      return render json: { message: N_('there was an issue triggering the task') }, status: :internal_server_error unless task

      render json: {
        task: task,
      }, status: :ok
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
