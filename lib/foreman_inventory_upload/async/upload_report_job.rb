require 'tempfile'

module ForemanInventoryUpload
  module Async
    class UploadReportJob < ShellProcess
      def self.output_label(label)
        "upload_for_#{label}"
      end

      def plan(filename, organization_id, disconnected = false)
        label = UploadReportJob.output_label(organization_id)
        super(label, filename: filename, organization_id: organization_id, disconnected: disconnected)
      end

      def try_execute
        if content_disconnected?
          progress_output do |progress_output|
            progress_output.write_line('Upload canceled because connection to Insights is not enabled or the --no-upload option was passed.')
            progress_output.status = "Task aborted, exit 1"
            done!
          end
          return
        end

        unless organization.owner_details&.fetch('upstreamConsumer')&.fetch('idCert')
          logger.info("Skipping organization '#{organization}', no candlepin certificate defined.")
          progress_output do |progress_output|
            progress_output.write_line("Skipping organization #{organization}, no candlepin certificate defined.")
            progress_output.status = "Task aborted, exit 1"
            done!
          end
          return
        end

        Tempfile.create([organization.name, '.pem']) do |cer_file|
          cer_file.write(certificate[:cert])
          cer_file.write(certificate[:key])
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

        http_proxy_string = ForemanRhCloud.http_proxy_string
        if http_proxy_string
          env_vars['http_proxy'] = http_proxy_string
          env_vars['https_proxy'] = http_proxy_string
        end
        env_vars
      end

      def certificate
        ForemanRhCloud.with_local_advisor_engine? ? foreman_certificate : manifest_certificate
      end

      def manifest_certificate
        @manifest_certificate ||= begin
          candlepin_id_certificate = organization.owner_details['upstreamConsumer']['idCert']
          {
            cert: candlepin_id_certificate['cert'],
            key: candlepin_id_certificate['key'],
          }
        end
      end

      def foreman_certificate
        @foreman_certificate ||= {
          cert: File.read(Setting[:ssl_certificate]),
          key: File.read(Setting[:ssl_priv_key]),
        }
      end

      def filename
        input[:filename]
      end

      def organization
        @organization ||= Organization.find(input[:organization_id])
      end

      def content_disconnected?
        input[:disconnected] || !Setting[:subscription_connection_enabled]
      end
    end
  end
end
