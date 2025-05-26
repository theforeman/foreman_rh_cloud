module ForemanRhCloud
  module GatewayRequest
    extend ActiveSupport::Concern

    include CloudRequest

    def execute_cloud_request(params)
      certs = params.delete(:certs) || foreman_certificates
      final_params = {
        ssl_client_cert: OpenSSL::X509::Certificate.new(certs[:cert]),
        ssl_client_key: OpenSSL::PKey.read(certs[:key]),
        ssl_ca_file: Setting[:ssl_ca_file],
        verify_ssl: OpenSSL::SSL::VERIFY_PEER,
      }.deep_merge(params)

      super(final_params)
    end

    def foreman_certificates
      {
        cert: File.read(Setting[:ssl_certificate]),
        key: File.read(Setting[:ssl_priv_key]),
      }
    end
  end
end
