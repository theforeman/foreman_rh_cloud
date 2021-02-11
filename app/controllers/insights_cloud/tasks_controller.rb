module InsightsCloud
  class TasksController < ::ApplicationController
    def create
      job = InsightsCloud::Async::InsightsFullSync.perform_later
      task = ForemanTasks::Task.find_by(external_id: job.provider_job_id)

      render json: {
        task: task,
      }, status: :ok
    end
  end
end
