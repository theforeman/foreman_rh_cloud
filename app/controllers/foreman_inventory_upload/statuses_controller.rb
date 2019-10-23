module ForemanInventoryUpload
  class StatusesController < ::ApplicationController
    # override default "welcome screen behavior, since we don't have a model"
    def welcome
      true
    end

    def index
      labels = Organization.all.pluck(:id, :name)

      statuses = Hash[
        labels.map do |id, label|
          generate_report_status = status_for(id, ForemanInventoryUpload::Async::GenerateReportJob)
          upload_report_status = status_for(id, ForemanInventoryUpload::Async::UploadReportJob)

          [
            label,
            {
              generate_report_status: generate_report_status,
              upload_report_status: upload_report_status,
            },
          ]
        end
      ]

      render json: {
        statuses: statuses,
      }, status: :ok
    end

    private

    def status_for(label, job_class)
      label = job_class.output_label(label)
      ForemanInventoryUpload::Async::ProgressOutput.get(label)&.status
    end
  end
end
