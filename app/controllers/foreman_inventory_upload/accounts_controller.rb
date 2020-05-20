module ForemanInventoryUpload
  class AccountsController < ::ApplicationController
    def index
      organizations = resource_base
      labels = organizations.pluck(:id, :name)

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
        autoUploadEnabled: Setting[:allow_auto_inventory_upload],
        accounts: accounts,
      }, status: :ok
    end

    private

    def status_for(label, job_class)
      label = job_class.output_label(label)
      ForemanInventoryUpload::Async::ProgressOutput.get(label)&.status
    end

    def model_of_controller
      ::Organization
    end
  end
end
