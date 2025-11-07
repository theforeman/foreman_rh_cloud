# frozen_string_literal: true

module ForemanInventoryUpload
  class ReportsController < ::ApplicationController
    include InventoryUpload::ReportActions

    def generate
      organization_id = params[:organization_id]
      disconnected = params[:disconnected]

      task = start_report_generation(organization_id, disconnected)

      render json: {
        id: task.id,
        humanized: {
          action: task.action,
        },
      }, status: :ok
    end
  end
end
