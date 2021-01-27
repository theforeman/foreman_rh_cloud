module ForemanInventoryUpload
  class AccountsController < ::ApplicationController
    def index
      organizations = User.current.my_organizations
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
        cloudToken: Setting[:rh_cloud_token],
        accounts: accounts,
        CloudConnectorStatus: ForemanInventoryUpload::UploadsSettingsController.cloud_connector_status,
      }, status: :ok
    end

    private

    def status_for(label, job_class)
      label = job_class.output_label(label)
      ForemanInventoryUpload::Async::ProgressOutput.get(label)&.status
    end
  end
end
