require 'tempfile'

module ForemanInventoryUpload
  module Async
    class UploadReportJob < ShellProcess
      def self.output_label(label)
        "upload_for_#{label}"
      end

      def plan(filename, organization_id)
        label = UploadReportJob.output_label(organization_id)
        super(label, filename: filename, organization_id: organization_id)
      end

      def run
        if content_disconnected?
          progress_output do |progress_output|
            progress_output.write_line('Upload was stopped since disconnected mode setting is enabled for content on this instance.')
            progress_output.status = "Task aborted, exit 1"
          end
          return
        end

        unless organization.owner_details&.fetch('upstreamConsumer')&.fetch('idCert')
          logger.info("Skipping organization '#{organization}', no candlepin certificate defined.")
          progress_output do |progress_output|
            progress_output.write_line("Skipping organization #{organization}, no candlepin certificate defined.")
            progress_output.status = "Task aborted, exit 1"
          end
          return
        end

        Tempfile.create([organization.name, '.pem']) do |cer_file|
          cer_file.write(rh_credentials[:cert])
          cer_file.write(rh_credentials[:key])
          cer_file.flush
          @cer_path = cer_file.path
          super
        end
      end

      def command
        ['/bin/bash', File.join(File.dirname(filename), ForemanInventoryUpload.upload_script_file)]
      end

      def env
        env_vars = super.merge(
          'FILES' => filename,
          'CER_PATH' => @cer_path
        )

        http_proxy_string = ForemanRhCloud.http_proxy_string(logger: logger)
        if http_proxy_string
          env_vars['http_proxy'] = http_proxy_string
          env_vars['https_proxy'] = http_proxy_string
        end
        env_vars
      end

      def rh_credentials
        @rh_credentials ||= begin
          candlepin_id_certificate = organization.owner_details['upstreamConsumer']['idCert']
          {
            cert: candlepin_id_certificate['cert'],
            key: candlepin_id_certificate['key'],
          }
        end
      end

      def filename
        input[:filename]
      end

      def organization
        @organization ||= Organization.find(input[:organization_id])
      end

      def content_disconnected?
        Setting[:content_disconnected]
      end
    end
  end
end
