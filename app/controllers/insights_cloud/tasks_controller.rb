module InsightsCloud
  class TasksController < ::ApplicationController
    def create
      selected_org = Organization.current
      InsightsCloud::Async::InsightsFullSync.perform_now(selected_org)
    end
  end
end
