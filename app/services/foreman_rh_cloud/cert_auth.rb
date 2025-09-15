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
      # Cache the value of with_iop_smart_proxy? to avoid multiple calls to the database
      with_iop_smart_proxy = ForemanRhCloud.with_iop_smart_proxy?
      certs = with_iop_smart_proxy ? foreman_certificate : candlepin_id_cert(organization)
      default_params = {
        ssl_client_cert: OpenSSL::X509::Certificate.new(certs[:cert]),
        ssl_client_key: OpenSSL::PKey.read(certs[:key]),
      }

      if with_iop_smart_proxy && organization&.label
        default_params[:headers] = {
          'X-Org-Id' => organization&.label,
        }
      end

      final_params = default_params.deep_merge(params)

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
