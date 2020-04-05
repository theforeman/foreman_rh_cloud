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
      path = Rails.root.join(ForemanInventoryUpload.uploads_folder, filename)
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

    def auto_upload
      Setting[:allow_auto_inventory_upload] = auto_upload_params
      render json: {
        autoUploadEnabled: Setting[:allow_auto_inventory_upload],
      }
    end

    def auto_upload_params
      ActiveModel::Type::Boolean.new.cast(params.require(:value))
    end
  end
end
