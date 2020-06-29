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
      throw_flash_error "File doesn't exist"
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

    def host_obfuscation
      Setting[:obfuscate_inventory_hostnames] = host_obfuscation_params
      render json: {
        hostObfuscationEnabled: Setting[:obfuscate_inventory_hostnames],
      }
    end

    def host_obfuscation_params
      ActiveModel::Type::Boolean.new.cast(params.require(:value))
    end
  end
end
