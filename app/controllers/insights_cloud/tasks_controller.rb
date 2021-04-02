module InsightsCloud
  class TasksController < ::ApplicationController
    def create
      task = ForemanTasks.async_task(InsightsCloud::Async::InsightsFullSync)

      render json: {
        task: task,
      }, status: :ok
    end
  end
end
