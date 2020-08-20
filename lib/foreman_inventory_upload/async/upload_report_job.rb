require 'tempfile'

module ForemanInventoryUpload
  module Async
    class UploadReportJob < ShellProcess
      def self.output_label(label)
        "upload_for_#{label}"
      end

      def perform(filename, organization_id)
        label = UploadReportJob.output_label(organization_id)
        if Setting[:content_disconnected]
          progress_output_for(label) do |progress_output|
            progress_output.write_line('Upload was stopped since disconnected mode setting is enabled for content on this instance.')
            progress_output.status = "Task aborted, exit 1"
          end
          return
        end
        @filename = filename
        @organization = Organization.find(organization_id)

        Tempfile.create([@organization.name, '.pem']) do |cer_file|
          cer_file.write(rh_credentials[:cert])
          cer_file.write(rh_credentials[:key])
          cer_file.flush
          @cer_path = cer_file.path
          super(UploadReportJob.output_label(organization_id))
        end
      end

      def command
        File.join(File.dirname(@filename), ForemanInventoryUpload.upload_script_file)
      end

      def env
        env_vars = super.merge(
          'FILES' => @filename,
          'CER_PATH' => @cer_path
        )
        if http_proxy_string
          env_vars['http_proxy'] = http_proxy_string
          env_vars['https_proxy'] = http_proxy_string
        end
        env_vars
      end

      def http_proxy_string
        @http_proxy_string ||= begin
          if Setting[:content_default_http_proxy]
            HttpProxy.unscoped.find_by(name: Setting[:content_default_http_proxy])&.full_url
          end
        end
      end

      def rh_credentials
        @rh_credentials ||= begin
          candlepin_id_certificate = @organization.owner_details['upstreamConsumer']['idCert']
          {
            cert: candlepin_id_certificate['cert'],
            key: candlepin_id_certificate['key'],
          }
        end
      end
    end
  end
end
