module ForemanRhCloud
  module CertAuth
    extend ActiveSupport::Concern

    include CloudRequest
    include InsightsCloud::CandlepinCache

    def cert_auth_available?(organization)
      !!candlepin_id_cert(organization)
    end

    def execute_cloud_request(params)
      organization = params.delete(:organization)
      certs = ForemanRhCloud.with_local_advisor_engine? ? foreman_certificate : candlepin_id_cert(organization)
      final_params = {
        ssl_client_cert: OpenSSL::X509::Certificate.new(certs[:cert]),
        ssl_client_key: OpenSSL::PKey.read(certs[:key]),
      }.deep_merge(params)

      super(final_params)
    end

    def foreman_certificate
      @foreman_certificate ||= {
        cert: File.read(Setting[:ssl_certificate]),
        key: File.read(Setting[:ssl_priv_key]),
      }
    end
  end
end
