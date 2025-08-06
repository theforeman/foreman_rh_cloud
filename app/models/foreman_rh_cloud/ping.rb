module ForemanRhCloud
  class Ping
    OK_RETURN_CODE = 'ok'.freeze
    FAIL_RETURN_CODE = 'FAIL'.freeze

    
    class << self
      include ForemanRhCloud::CertAuth
      
      def iop_smart_proxy_url
        @iop_smart_proxy_url ||= ForemanRhCloud.iop_smart_proxy.url
      end

      def service_urls
        {
          :advisor => "#{iop_smart_proxy_url}/api/insights/v1/status/live/",
          :vulnerability => "#{iop_smart_proxy_url}/api/vulnerability/v1/apistatus"
        }
      end

      def services
        service_urls.keys
      end

      def status
        {
          iop_smart_proxy_exists: ForemanRhCloud.with_iop_smart_proxy?,
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
        options[:ssl_client_cert] = OpenSSL::X509::Certificate.new(foreman_certificate[:cert])
        options[:ssl_client_key] = OpenSSL::PKey.read(foreman_certificate[:key]) 

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
          ping_url(service_urls[service_name])
        end
      end
    end
  end
end
