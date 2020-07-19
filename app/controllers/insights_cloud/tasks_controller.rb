module InventorySync
  class TasksController < ::ApplicationController
    def create
      selected_org = Organization.current
      InventorySync::Async::InventoryFullSync.perform_now(selected_org)
    end
  end
end
