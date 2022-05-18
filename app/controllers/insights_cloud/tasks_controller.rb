module InsightsCloud
  class TasksController < ::ApplicationController
    def create
      task = ForemanTasks.async_task(InsightsCloud::Async::InsightsFullSync, Organization.authorized)

      render json: {
        task: task,
      }, status: :ok
    end
  end
end
