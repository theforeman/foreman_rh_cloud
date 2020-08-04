module InsightsCloud
  class TasksController < ::ApplicationController
    def create
      InsightsCloud::Async::InsightsFullSync.perform_now
    end
  end
end
