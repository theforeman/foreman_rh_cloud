require 'tempfile'
require 'rest-client'

module ForemanInventoryUpload
  module Async
    class UploadReportDirectJob < ::Actions::EntryAction
      include AsyncHelpers
      include ::ForemanRhCloud::Async::ExponentialBackoff
      include ::ForemanRhCloud::CloudRequest

      # Wrapper class to avoid monkey-patching File for multipart uploads
      class FileUpload
        attr_reader :file, :content_type

        def initialize(file, content_type:)
          @file = file
          @content_type = content_type
        end

        def read(*args)
          @file.read(*args)
        end

        def path
          @file.path
        end

        def respond_to_missing?(method_name, include_private = false)
          @file.respond_to?(method_name, include_private) || super
        end

        def method_missing(method_name, *args, &block)
          if @file.respond_to?(method_name)
            @file.send(method_name, *args, &block)
          else
            super
          end
        end
      end

      def self.output_label(label)
        "upload_for_#{label}"
      end

      def plan(filename, organization_id)
        # NOTE: This implementation assumes a single organization will not trigger multiple
        # concurrent uploads. The instance_label is derived from organization_id alone, which
        # means concurrent uploads for the same org would share ProgressOutput storage.
        # This matches the pattern in GenerateReportJob. A full fix for thread-safety
        # requires UI changes to display multiple concurrent tasks per org (tracked for PR #2).
        label = UploadReportDirectJob.output_label(organization_id)
        clear_task_output(label)
        plan_self(
          instance_label: label,
          filename: filename,
          organization_id: organization_id
        )
      end

      def try_execute
        if content_disconnected?
          progress_output do |progress_output|
            progress_output.write_line("Report was not moved and upload was canceled because connection to Insights is not enabled. Report location: #{filename}.")
            progress_output.status = "Task aborted, exit 1"
            done!
          end
          return
        end

        unless organization.owner_details&.dig('upstreamConsumer', 'idCert')
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
          upload_report(cer_file.path)
        end

        done!
      end

      def upload_report(cer_path)
        progress_output do |progress_output|
          progress_output.write_line("Uploading report for organization #{organization.label}...")
          progress_output.status = "Running upload"

          begin
            upload_file(cer_path)
            progress_output.write_line("Upload completed successfully")
            move_to_done_folder
            progress_output.write_line("Uploaded file moved to done/ folder")
            progress_output.status = "pid #{Process.pid} exit 0"
          rescue StandardError => e
            progress_output.write_line("Upload failed: #{e.message}")
            progress_output.status = "pid #{Process.pid} exit 1"
            raise
          end
        end
      end

      def upload_file(cer_path)
        cert_content = File.read(cer_path)

        File.open(filename, 'rb') do |file|
          # Wrap file with FileUpload class for RestClient multipart handling
          # RestClient requires objects with :read, :path, and :content_type methods
          wrapped_file = FileUpload.new(file, content_type: 'application/vnd.redhat.qpc.tar+tgz')

          response = execute_cloud_request(
            method: :post,
            url: ForemanInventoryUpload.upload_url,
            payload: {
              multipart: true,
              file: wrapped_file,
            },
            headers: {
              'X-Org-Id' => organization.label,
            },
            ssl_client_cert: OpenSSL::X509::Certificate.new(cert_content),
            ssl_client_key: OpenSSL::PKey::RSA.new(cert_content),
            timeout: 600,
            open_timeout: 60
          )

          logger.debug("Upload response code: #{response.code}")
        end
      end

      def move_to_done_folder
        FileUtils.mkdir_p(ForemanInventoryUpload.done_folder)
        done_file = ForemanInventoryUpload.done_file_path(File.basename(filename))
        FileUtils.mv(filename, done_file)
        logger.debug("Moved #{filename} to #{done_file}")
      end

      def certificate
        ForemanRhCloud.with_iop_smart_proxy? ? foreman_certificate : manifest_certificate
      end

      def manifest_certificate
        candlepin_id_certificate = organization.owner_details['upstreamConsumer']['idCert']
        {
          cert: candlepin_id_certificate['cert'],
          key: candlepin_id_certificate['key'],
        }
      end

      def foreman_certificate
        {
          cert: File.read(Setting[:ssl_certificate]),
          key: File.read(Setting[:ssl_priv_key]),
        }
      end

      def filename
        input[:filename]
      end

      def organization
        Organization.find(input[:organization_id])
      end

      def content_disconnected?
        !Setting[:subscription_connection_enabled]
      end

      def progress_output
        progress_output = ProgressOutput.register(instance_label)
        yield(progress_output)
      ensure
        progress_output.close
      end

      def instance_label
        input[:instance_label]
      end

      def logger
        Foreman::Logging.logger('background')
      end

      def rescue_strategy_for_self
        Dynflow::Action::Rescue::Fail
      end

      def clear_task_output(label)
        TaskOutputLine.where(label: label).delete_all
        TaskOutputStatus.where(label: label).delete_all
      end
    end
  end
end
