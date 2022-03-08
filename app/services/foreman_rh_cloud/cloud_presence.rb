module ForemanRhCloud
  class CloudPresence
    include InsightsCloud::CandlepinCache
    include ForemanRhCloud::CloudRequest

    attr_reader :organization, :logger

    def initialize(organization, logger)
      @organization = organization
      @logger = logger
    end

    def announce_to_sources
      register_rhc_instance
    end

    def satellite_source_type
      @satellite_source_type ||= begin
        source_type_response = JSON.parse(
          execute_cloud_request(
            method: :get,
            url: source_type_url,
            headers: {
              content_type: :json,
            },
            ssl_client_cert: OpenSSL::X509::Certificate.new(certs[:cert]),
            ssl_client_key: OpenSSL::PKey::RSA.new(certs[:key])
          )
        )

        source_type_response['data'].first['id']
      end
    end

    def satellite_instance_source
      @satellite_instance_source ||= begin
        source_response = JSON.parse(
          execute_cloud_request(
            method: :get,
            url: satellite_instance_source_url,
            headers: {
              content_type: :json,
            },
            ssl_client_cert: OpenSSL::X509::Certificate.new(certs[:cert]),
            ssl_client_key: OpenSSL::PKey::RSA.new(certs[:key])
          )
        )

        result = source_response['data'].first
        result&.dig('id')
      end
    end

    def create_satellite_instance_source
      create_response = JSON.parse(
        execute_cloud_request(
          method: :post,
          url: create_satellite_instance_source_url,
          headers: {
            content_type: :json,
          },
          ssl_client_cert: OpenSSL::X509::Certificate.new(certs[:cert]),
          ssl_client_key: OpenSSL::PKey::RSA.new(certs[:key]),
          payload: {
            name: "satellite: #{Foreman.instance_id} org: #{@organization.name}",
            source_ref: Foreman.instance_id,
            source_type_id: satellite_source_type
          }.to_json,
        )
      )

      @satellite_instance_source = create_response['id']
    end

    def register_rhc_instance
      source_id = satellite_instance_source || create_satellite_instance_source

      create_response = JSON.parse(
        execute_cloud_request(
          method: :post,
          url: create_rhc_connections_url,
          headers: {
            content_type: :json,
          },
          ssl_client_cert: OpenSSL::X509::Certificate.new(certs[:cert]),
          ssl_client_key: OpenSSL::PKey::RSA.new(certs[:key]),
          payload: {
            source_id: source_id,
            rhc_id: Setting[:rhc_instance_id]
          }.to_json
        )
      )

      @satellite_instance_source = create_response['id']
    end

    private

    def sources_url(path)
      "#{ForemanRhCloud.cert_base_url}/api/sources/v3.1#{path}"
    end

    def source_type_url
      sources_url('/source_types?filter[name]=satellite')
    end

    def satellite_instance_source_url
      sources_url("/sources?filter[source_ref]=#{Foreman.instance_id}")
    end

    def create_satellite_instance_source_url
      sources_url('/sources')
    end

    def create_rhc_connections_url
      sources_url('/rhc_connections')
    end

    def certs
      @certs ||= candlepin_id_cert(@organization)
    end
  end
end
