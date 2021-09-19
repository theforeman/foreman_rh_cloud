# frozen_string_literal: true

module ForemanInventoryUpload
  class ReportsController < ::ApplicationController
    include InventoryUpload::ReportActions

    def last
      label = ForemanInventoryUpload::Async::GenerateReportJob.output_label(params[:organization_id])
      output = ForemanInventoryUpload::Async::ProgressOutput.get(label)&.full_output
      task_label = ForemanInventoryUpload::Async::GenerateAllReportsJob.name
      scheduled = ForemanTasks::Task.where(
        :label => task_label,
        :state => 'scheduled'
      ).first&.start_at || nil

      render json: {
        output: output,
        scheduled: scheduled,
      }, status: :ok
    end

    def generate
      organization_id = params[:organization_id]

      start_report_generation(organization_id)

      render json: {
        action_status: 'success',
      }, status: :ok
    end
  end
end
