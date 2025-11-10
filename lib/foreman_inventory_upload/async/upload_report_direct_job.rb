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
        organization = Organization.find(organization_id)
        action_subject(organization)

        plan_self(
          filename: filename,
          organization_id: organization_id
        )
      end

      def try_execute
        if content_disconnected?
          logger.info("Upload canceled: connection to Insights is not enabled. Report location: #{filename}")
          return
        end

        unless organization.owner_details&.dig('upstreamConsumer', 'idCert')
          logger.info("Skipping organization '#{organization}', no candlepin certificate defined.")
          return
        end

        Tempfile.create([organization.name, '.pem']) do |cer_file|
          cer_file.write(certificate[:cert])
          cer_file.write(certificate[:key])
          cer_file.flush
          upload_file(cer_file.path)
        end

        move_to_done_folder
        done!
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
        if File.exist?(done_file)
          logger.warn("Destination file #{done_file} already exists. Overwriting with new report.")
        end
        FileUtils.mv(filename, done_file, force: true)
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
        cert_path = Setting[:ssl_certificate]
        key_path = Setting[:ssl_priv_key]

        unless cert_path && File.readable?(cert_path)
          raise "SSL certificate file not found or not readable: #{cert_path}"
        end

        unless key_path && File.readable?(key_path)
          raise "SSL private key file not found or not readable: #{key_path}"
        end

        {
          cert: File.read(cert_path),
          key: File.read(key_path),
        }
      end

      def filename
        input[:filename]
      end

      def organization
        Organization.find(input[:organization_id])
      end

      def content_disconnected?
        return false if ForemanRhCloud.with_iop_smart_proxy?
        !Setting[:subscription_connection_enabled]
      end

      def logger
        Foreman::Logging.logger('background')
      end

      def rescue_strategy_for_self
        Dynflow::Action::Rescue::Fail
      end
    end
  end
end
