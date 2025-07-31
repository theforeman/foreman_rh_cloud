module ForemanRhCloud
  class Ping
    OK_RETURN_CODE = 'ok'.freeze
    FAIL_RETURN_CODE = 'FAIL'.freeze

    SERVICE_URLS = {
      :advisor => "https://localhost:24443/api/insights/v1/status/live/",
      :vulnerability => "https://localhost:24443/api/vulnerability/v1/apistatus"
    }

    class << self
      def services
        SERVICE_URLS.keys
      end

      def status
        {
          version: ForemanRhCloud::VERSION,
          timeUTC: Time.now.getutc,
        }
      end

      def exception_watch(result, &blk)
        ::Katello::Ping.exception_watch(result, &blk)
      end

      def ping
        ping_services
      end

      def ping!
        result = ping_services

        if result[:status] != OK_RETURN_CODE
          failed_names = result[:services].select do |_name, details|
            details[:status] != OK_RETURN_CODE
          end
          fail "The following services have not been started or are reporting errors: #{failed_names.keys.join(', ')}"
        end

        result
      end

      def ping_services
        result = {}
        services.each do |service|
          result[service] = {}
          ping_service(service, result[service])
        end

        # set overall status result code
        result = {:services => result}
        result[:status] = result[:services].each_value.any? { |v| v[:status] == FAIL_RETURN_CODE } ? FAIL_RETURN_CODE : OK_RETURN_CODE
        result
      end

      def ping_url(url)
        ca_file = Setting[:ssl_ca_file]
        request_id = ::Logging.mdc['request']

        options = {}
        options[:ssl_ca_file] = ca_file unless ca_file.nil?
        options[:ssl_client_cert] = OpenSSL::X509::Certificate.new(File.read(Setting[:ssl_certificate]))
        options[:ssl_client_key] = OpenSSL::PKey.read(File.read(Setting[:ssl_priv_key])) 

        client = RestClient::Resource.new(url, options)

        response = client.get
        return {} if response.empty?
        begin 
          result = JSON.parse(response).with_indifferent_access
        rescue JSON::ParserError, NoMethodError
          result = { :response => response.body&.strip }
        end
        result
      end

      def ping_service(service_name, service_result_hash)
        exception_watch(service_result_hash) do
          ping_url(SERVICE_URLS[service_name])
        end
      end
    end
  end
end
