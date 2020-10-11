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
      render_setting(:autoUploadEnabled, :allow_auto_inventory_upload)
    end

    def show_auto_upload
      render_setting(:autoUploadEnabled, :allow_auto_inventory_upload)
    end

    def auto_upload_params
      ActiveModel::Type::Boolean.new.cast(params.require(:value))
    end

    def host_obfuscation
      Setting[:obfuscate_inventory_hostnames] = host_obfuscation_params
      render_setting(:hostObfuscationEnabled, :obfuscate_inventory_hostnames)
    end

    def host_obfuscation_params
      ActiveModel::Type::Boolean.new.cast(params.require(:value))
    end

    def installed_packages_inclusion
      Setting[:exclude_installed_packages] = host_obfuscation_params
      render_setting(:excludePackages, :exclude_installed_packages)
    end

    def installed_packages_inclusion_params
      ActiveModel::Type::Boolean.new.cast(params.require(:value))
    end

    def ips_obfuscation
      Setting[:obfuscate_inventory_ips] = ips_obfuscation_params
      render_setting(:ipsObfuscationEnabled, :obfuscate_inventory_ips)
    end

    def ips_obfuscation_params
      ActiveModel::Type::Boolean.new.cast(params.require(:value))
    end

    private

    def render_setting(node_name, setting)
      render json: {
        node_name => Setting[setting],
      }
    end
  end
end
