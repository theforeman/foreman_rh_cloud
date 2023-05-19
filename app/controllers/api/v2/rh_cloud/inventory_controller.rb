module Api
  module V2
    module RhCloud
      class InventoryController < ::Api::V2::BaseController
        include ::Api::Version2
        include InventoryUpload::ReportActions
        include InventoryUpload::TaskActions

        api :GET, "/organizations/:organization_id/rh_cloud/report", N_("Download latest report")
        param :organization_id, Integer, required: true, desc: N_("Set the current organization context for the request")
        def download_file
          filename, file = report_file(params[:organization_id])

          send_file file, disposition: 'attachment', filename: filename
        rescue InventoryUpload::ReportActions::ReportMissingError => error
          render json: { message: error.message }, status: :not_found
        end

        api :POST, "/organizations/:organization_id/rh_cloud/report", N_("Start report generation")
        param :organization_id, Integer, required: true, desc: N_("Set the current organization context for the request")
        def generate_report
          organization_id = params[:organization_id]

          start_report_generation(organization_id)

          render json: {
            action_status: 'success',
          }, status: :ok
        end

        api :GET, "/organizations/:organization_id/rh_cloud/missing_hosts", N_("Grab hosts that are missing in RH Cloud")
        param :organization_id, Integer, required: true, desc: N_("Set the current organization context for the request")
        def get_hosts
          organization_id = params[:organization_id]
          payload = InsightsMissingHosts.where(organization_id: organization_id)

          render :json => payload
        end

        api :POST, "/organizations/:organization_id/rh_cloud/missing_hosts", N_("Grab hosts that are missing in RH Cloud")
        param :organization_id, Integer, required: true, desc: N_("Set the current organization context for the request")
        param :search_term, String, required: true, desc: N_("Scoped search string for host removal")
        def remove_hosts
          organization_id = params[:organization_id]
          search_term = params[:search_term]

          task = ForemanTasks.async_task(ForemanInventoryUpload::Async::RemoveInsightsHostsJob, search_term, organization_id)

          render json: {
            task: task,
          }, status: :ok
        end

        api :POST, "/organizations/:organization_id/rh_cloud/inventory_sync", N_("Start inventory synchronization")
        param :organization_id, Integer, required: true, desc: N_("Set the current organization context for the request")
        def sync_inventory_status
          selected_org = Organization.find(params[:organization_id])

          task = start_inventory_sync(selected_org)

          render json: {
            task: task,
          }, status: :ok
        rescue InventoryUpload::TaskActions::NothingToSyncError => error
          render json: { message: error.message }, status: :bad_request
        end

        api :POST, "/rh_cloud/enable_connector", N_("Enable cloud connector")
        def enable_cloud_connector
          cloud_connector = ForemanRhCloud::CloudConnector.new
          render json: cloud_connector.install.to_json
        end
      end
    end
  end
end
