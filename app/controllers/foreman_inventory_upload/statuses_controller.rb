module ForemanInventoryUpload
  class StatusesController < ::ApplicationController
    # override default "welcome screen behavior, since we don't have a model"
    def welcome
      true
    end

    def index
      portal_users = RedhatAccess::TelemetryConfiguration
                     .where(enable_telemetry: true)
                     .distinct
                     .pluck(:portal_user)

      statuses = Hash[
        portal_users.map do |portal_user|
          generate_report_status = status_for(portal_user, ForemanInventoryUpload::Async::GenerateReportJob)
          upload_report_status = status_for(portal_user, ForemanInventoryUpload::Async::UploadReportJob)

          [
            portal_user,
            {
              generate_report_status: generate_report_status,
              upload_report_status: upload_report_status
            }
          ]
        end
      ]

      render json: {
        statuses: statuses
      }, status: :ok
    end

    private

    def status_for(portal_user, job_class)
      label = job_class.output_label(portal_user)
      ForemanInventoryUpload::Async::ProgressOutput.get(label)&.status
    end
  end
end
