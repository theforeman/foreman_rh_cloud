module ForemanInventoryUpload
  module Async
    class QueueForUploadJob < ::ApplicationJob
      def perform(base_folder, report_file, organization_id)
        @base_folder = base_folder
        @report_file = report_file
        logger.debug('Ensuring objects')
        ensure_ouput_folder
        ensure_output_script
        logger.debug("Copying #{report_file} to #{uploads_folder}")
        enqueued_file_name = File.join(uploads_folder, report_file)
        FileUtils.mv(File.join(base_folder, report_file), enqueued_file_name)
        logger.debug("Done copying #{report_file} to #{enqueued_file_name}")

        UploadReportJob.perform_later(enqueued_file_name, organization_id)
      end

      def uploads_folder
        @uploads_folder ||= ForemanInventoryUpload.uploads_folder
      end

      def script_file
        @script_file ||= File.join(uploads_folder, ForemanInventoryUpload.upload_script_file)
      end

      def ensure_ouput_folder
        FileUtils.mkdir_p(uploads_folder)
      end

      def ensure_output_script
        return if File.exist?(script_file)

        script_source_file = File.join(ForemanInventoryUpload::Engine.root, 'app/views/scripts/uploader.sh.erb')

        script_source = File.read(script_source_file)
        script_source.gsub!('<%= @upload_url %>', @upload_url)
        script_source.gsub!('<%= @rh_username %>', @rh_username)

        File.write(script_file, script_source)
        FileUtils.chmod('+x', script_file)
      end

      def logger
        Foreman::Logging.logger('background')
      end
    end
  end
end
