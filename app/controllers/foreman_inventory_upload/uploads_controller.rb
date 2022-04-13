module ForemanInventoryUpload
  class UploadsController < ::ApplicationController
    include InventoryUpload::ReportActions

    def last
      label = ForemanInventoryUpload::Async::UploadReportJob.output_label(params[:organization_id])
      output = ForemanInventoryUpload::Async::ProgressOutput.get(label)&.full_output

      render json: {
        output: output,
      }, status: :ok
    end

    def download_file
      filename, file = report_file(params[:organization_id])

      send_file file, disposition: 'attachment', filename: filename
    end

    def enable_cloud_connector
      Organization.unscoped.each do |org|
        presence = ForemanRhCloud::CloudPresence.new(org, logger)
        presence.announce_to_sources
      rescue StandardError => ex
        logger.warn(ex)
      end

      cloud_connector = ForemanRhCloud::CloudConnector.new
      render json: cloud_connector.install.to_json
    end
  end
end
