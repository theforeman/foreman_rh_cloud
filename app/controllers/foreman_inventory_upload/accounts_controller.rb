module ForemanInventoryUpload
  class AccountsController < ::ApplicationController
    # override default "welcome screen behavior, since we don't have a model"
    def welcome
      true
    end

    def index
      labels = Organization.all.pluck(:id, :name)

      accounts = Hash[
        labels.map do |id, label|
          generate_report_status = status_for(id, ForemanInventoryUpload::Async::GenerateReportJob)
          upload_report_status = status_for(id, ForemanInventoryUpload::Async::UploadReportJob)

          [
            id,
            {
              generate_report_status: generate_report_status,
              upload_report_status: upload_report_status,
              label: label,
            },
          ]
        end
      ]

      render json: {
        accounts: accounts,
      }, status: :ok
    end

    private

    def status_for(label, job_class)
      label = job_class.output_label(label)
      ForemanInventoryUpload::Async::ProgressOutput.get(label)&.status
    end
  end
end
