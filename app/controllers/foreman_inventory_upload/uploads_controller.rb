module ForemanInventoryUpload
  class UploadsController < ::ApplicationController
    def last
      label = ForemanInventoryUpload::Async::UploadReportJob.output_label(params[:portal_user])
      output = ForemanInventoryUpload::Async::ProgressOutput.get(label)&.full_output

      render json: {
        output: output
      }, status: :ok
    end

    def download_file
      filename = 'hosts_report.tar.gz'
      path = Rails.root.join(ForemanInventoryUpload.uploads_folder(params[:portal_user]), filename)
      unless File.exist? path
        return throw_flash_error(
          "Path doesn't exist: #{path}"
        )
      end

      send_file path, disposition: 'attachment', filename: filename
    end

    def throw_flash_error(message)
      process_error(
        :redirect => foreman_inventory_upload_index_path,
        :error_msg => message
      )
    end
  end
end
