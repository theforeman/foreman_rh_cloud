module ForemanInventoryUpload
  module Async
    class QueueForUploadJob < ::ApplicationJob
      def perform(report_file, portal_user)
        @portal_user = portal_user
        logger.debug('Ensuring objects')
        ensure_ouput_folder
        ensure_output_script
        logger.debug("Copying #{report_file} to #{uploads_folder}")
        enqueued_file_name = File.join(uploads_folder, ForemanInventoryUpload.facts_archive_name)
        FileUtils.mv(report_file, enqueued_file_name)
        logger.debug("Done copying #{report_file} to #{enqueued_file_name}")

        UploadReportJob.perform_later(enqueued_file_name, portal_user)
      end

      def uploads_folder
        @uploads_folder ||= ForemanInventoryUpload.uploads_folder(@portal_user)
      end

      def script_file
        @script_file ||= File.join(uploads_folder, ForemanInventoryUpload.upload_script_file)
      end

      def ensure_ouput_folder
        FileUtils.mkdir_p(uploads_folder)
      end

      def ensure_output_script
        return if File.exist?(script_file)

        script_source = File.join(ForemanInventoryUpload::Engine.root, 'app/views/scripts/uploader.sh.erb')

        template_src = Foreman::Renderer::Source::String.new(content: File.read(script_source))
        scope = Foreman::Renderer::Scope::Base.new(
          source: template_src,
          variables: {
            upload_url: ForemanInventoryUpload.upload_url,
            rh_username: @portal_user,
          }
        )
        script_source = Foreman::Renderer.render(template_src, scope)
        File.write(script_file, script_source)
        FileUtils.chmod('+x', script_file)
      end

      def logger
        Foreman::Logging.logger('background')
      end
    end
  end
end
