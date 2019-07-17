module ForemanYupana
  module Async
    class QueueForUploadJob
      include SuckerPunch::Job

      def perform(facts_file)
        SuckerPunch.logger.debug('Ensuring objects')
        ensure_ouput_folder
        ensure_output_script
        SuckerPunch.logger.debug("Copying #{facts_file} to #{ForemanYupana.uploads_folder}")
        FileUtils.mv(facts_file, ForemanYupana.uploads_folder)
        SuckerPunch.logger.debug("Done copying #{facts_file} to #{ForemanYupana.uploads_folder}")

        UploadReportJob.perform_async(ForemanYupana.uploader_output)
      end

      def ensure_ouput_folder
        FileUtils.mkdir_p(ForemanYupana.uploads_folder)
      end

      def ensure_output_script
        return if File.exits?(ForemanYupana.upload_script_file)

        template_src = Foreman::Renderer::Source::String(File.read('app/views/scripts/uploader.sh.erb'))
        scope = Foreman::Renderer.get_scope(
          source: template_src,
          klass: Foreman::Renderer::Scope::Base,
          params: {
            upload_url: ForemanYupana.upload_url,
            uploads_folder: ForemanYupana.uploads_folder
          }
        )
        script_source = Foreman::Renderer.render(template_src, scope)
        File.write(foreman.upload_script_file, script_source)
      end
    end
  end
end
