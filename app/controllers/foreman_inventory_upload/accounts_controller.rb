module ForemanInventoryUpload
  class AccountsController < ::ApplicationController
    def index
      organizations = User.current.my_organizations
      labels = organizations.pluck(:id, :name)

      accounts = Hash[
        labels.map do |id, label|
          generate_report_status = status_for(id, ForemanInventoryUpload::Async::GenerateReportJob)
          upload_report_status = status_for(id, ForemanInventoryUpload::Async::UploadReportDirectJob)
          report_file_paths = ForemanInventoryUpload.report_file_paths(id)

          [
            label,
            {
              generate_report_status: generate_report_status,
              upload_report_status: upload_report_status,
              report_file_paths: report_file_paths,
              id: id,
            },
          ]
        end
      ]

      render json: {
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
