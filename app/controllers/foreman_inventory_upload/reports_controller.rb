# frozen_string_literal: true

module ForemanInventoryUpload
  class ReportsController < ::ApplicationController
    def last
      label = ForemanInventoryUpload::Async::GenerateReportJob.output_label(params[:portal_user])
      output = ForemanInventoryUpload::Async::ProgressOutput.get(label)&.full_output
      task_label = ForemanInventoryUpload::Async::GenerateAllReportsJob.singleton_job_name
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
      portal_user = params[:portal_user]

      generated_file_name = File.join(ForemanInventoryUpload.base_folder, "#{portal_user}.tar.gz")
      ForemanInventoryUpload::Async::GenerateReportJob.perform_later(generated_file_name, portal_user)

      render json: {
        action_status: 'success',
      }, status: :ok
    end
  end
end
