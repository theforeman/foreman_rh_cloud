module ForemanYupana
  module Async
    class QueueForUploadJob
      include SuckerPunch::Job

      def perform(report_file, portal_user)
        @portal_user = portal_user
        SuckerPunch.logger.debug('Ensuring objects')
        ensure_ouput_folder
        ensure_output_script
        SuckerPunch.logger.debug("Copying #{report_file} to #{uploads_folder}")
        FileUtils.mv(report_file, uploads_folder)
        SuckerPunch.logger.debug("Done copying #{report_file} to #{uploads_folder}")

        enqueued_file_name = File.join(uploads_folder, ForemanYupana.facts_archive_name)

        UploadReportJob.perform_async(enqueued_file_name, portal_user)
      end

      def uploads_folder
        @uploads_folder ||= ForemanYupana.uploads_folder(@portal_user)
      end

      def script_file
        @script_file ||= File.join(uploads_folder, ForemanYupana.upload_script_file)
      end

      def ensure_ouput_folder
        FileUtils.mkdir_p(uploads_folder)
      end

      def ensure_output_script
        return if File.exist?(script_file)

        script_source = File.join(ForemanYupana::Engine.root, 'app/views/scripts/uploader.sh.erb')

        template_src = Foreman::Renderer::Source::String.new(content: File.read(script_source))
        scope = Foreman::Renderer::Scope::Base.new(
          source: template_src,
          variables: {
            upload_url: ForemanYupana.upload_url,
            rh_username: @portal_user
          }
        )
        script_source = Foreman::Renderer.render(template_src, scope)
        File.write(foreman.upload_script_file, script_source)
      end
    end
  end
end
