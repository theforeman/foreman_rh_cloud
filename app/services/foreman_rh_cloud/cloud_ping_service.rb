require 'rest-client'

module ForemanRhCloud
  class CloudPingService
    class CertPing
      include ForemanRhCloud::CloudRequest
      include InsightsCloud::CandlepinCache

      attr_accessor :logger

      def initialize(org, logger)
        @org = org
        @logger = logger
      end

      def ping
        certs = candlepin_id_cert(@org)
        return StandardError.new('certificate missing') unless certs

        cert_checker = Katello::UpstreamConnectionChecker.new(@org)
        cert_checker.assert_connection

        execute_cloud_request(
          method: :get,
          url: ForemanRhCloud.cert_base_url + "/api/apicast-tests/ping",
          headers: {
            content_type: :json,
          },
          ssl_client_cert: OpenSSL::X509::Certificate.new(certs[:cert]),
          ssl_client_key: OpenSSL::PKey.read(certs[:key])
        )
      rescue StandardError => ex
        ex
      end
    end

    def initialize(organizations, logger)
      @organizations = organizations
      @logger = logger
    end

    def ping
      {
        cert_auth: Hash[
          @organizations.map do |org|
            cert_response = CertPing.new(org, @logger).ping
            [
              org,
              {
                success: cert_response.is_a?(RestClient::Response),
                error: (cert_response.is_a?(Exception) ? cert_response&.message || cert_response.inspect : nil),
              },
            ]
          end
        ],
      }
    end
  end
end
