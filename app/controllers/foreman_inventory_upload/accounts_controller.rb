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
        autoUploadEnabled: Setting[:allow_auto_inventory_upload],
        hostObfuscationEnabled: Setting[:obfuscate_inventory_hostnames],
        ipsObfuscationEnabled: Setting[:obfuscate_inventory_ips],
        cloudToken: !Setting[:rh_cloud_token].empty?,
        excludePackages: Setting[:exclude_installed_packages],
        accounts: accounts,
        CloudConnectorStatus: cloud_connector_status,
      }, status: :ok
    end

    private

    def cloud_connector_status
      cloud_connector = ForemanRhCloud::CloudConnector.new
      job = cloud_connector&.latest_job
      return nil unless job
      { id: job.id, task: ForemanTasks::Task.where(:id => job.task_id).first }
    end

    def status_for(label, job_class)
      label = job_class.output_label(label)
      ForemanInventoryUpload::Async::ProgressOutput.get(label)&.status
    end
  end
end
