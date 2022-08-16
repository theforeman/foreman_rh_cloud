module ForemanRhCloud
  module CertAuth
    extend ActiveSupport::Concern

    include CloudRequest
    include InsightsCloud::CandlepinCache

    def cert_auth_available?(organization)
      !!candlepin_id_cert(organization)
    end

    def execute_cloud_request(params)
      certs = candlepin_id_cert(params.delete(:organization))
      final_params = {
        ssl_client_cert: OpenSSL::X509::Certificate.new(certs[:cert]),
        ssl_client_key: OpenSSL::PKey.read(certs[:key]),
      }.deep_merge(params)

      super(final_params)
    end
  end
end
