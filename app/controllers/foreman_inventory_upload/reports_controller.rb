module ForemanInventoryUpload
  class ReportsController < ::ApplicationController
    def last
      label = ForemanInventoryUpload::Async::GenerateReportJob.output_label(params[:portal_user])
      output = ForemanInventoryUpload::Async::ProgressOutput.get(label)&.full_output

      render json: {
        output: output
      }, status: :ok
    end

    def generate
      portal_user = params[:portal_user]

      generated_file_name = File.join(ForemanInventoryUpload.base_folder, "#{portal_user}.tar.gz")
      ForemanInventoryUpload::Async::GenerateReportJob.perform_async(generated_file_name, portal_user)

      render json: {
        action_status: 'success'
      }, status: :ok
    end
  end
end
