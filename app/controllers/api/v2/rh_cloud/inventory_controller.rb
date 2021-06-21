module Api
  module V2
    module RhCloud
      class InventoryController < ::Api::V2::BaseController
        include ::Api::Version2
        include InventoryUpload::ReportActions
        include InventoryUpload::TaskActions

        api :GET, "/organizations/:organization_id/rh_cloud/report", N_("Download latest report")
        def download_file
          filename, file = report_file(params[:organization_id])

          send_file file, disposition: 'attachment', filename: filename
        end

        api :POST, "/organizations/:organization_id/rh_cloud/report", N_("Start report generation")
        def generate_report
          organization_id = params[:organization_id]

          start_report_generation(organization_id)

          render json: {
            action_status: 'success',
          }, status: :ok
        end

        api :POST, "/organizations/:organization_id/rh_cloud/inventory_sync", N_("Start inventory synchronization")
        def sync_inventory_status
          selected_org = params[:organization_id]

          task = start_inventory_sync(selected_org)

          render json: {
            task: task,
          }, status: :ok
        rescue InventoryUpload::TaskActions::NothingToSyncError => error
            return render json: { message: error.message }, status: :internal_server_error
        end

        api :POST, "rh_cloud/enable_connector", N_("Enable cloud connector")
        def enable_cloud_connector
          cloud_connector = ForemanRhCloud::CloudConnector.new
          render json: cloud_connector.install.to_json
        end
      end
    end
  end
end