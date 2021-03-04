module ForemanInventoryUpload
  class UploadsController < ::ApplicationController
    def last
      label = ForemanInventoryUpload::Async::UploadReportJob.output_label(params[:organization_id])
      output = ForemanInventoryUpload::Async::ProgressOutput.get(label)&.full_output

      render json: {
        output: output,
      }, status: :ok
    end

    def download_file
      filename = ForemanInventoryUpload.facts_archive_name(params[:organization_id])
      files = Dir["{#{ForemanInventoryUpload.uploads_file_path(filename)},#{ForemanInventoryUpload.done_file_path(filename)}}"]

      return send_file files.first, disposition: 'attachment', filename: filename unless files.empty?
      raise ::Foreman::Exception.new("The report file doesn't exist")
    end

    def enable_cloud_connector
      cloud_connector = ForemanRhCloud::CloudConnector.new
      render json: cloud_connector.install.to_json
    end
  end
end
