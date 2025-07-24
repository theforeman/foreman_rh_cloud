module ForemanRhCloud
  class Ping
    OK_RETURN_CODE = 'ok'.freeze
    FAIL_RETURN_CODE = 'FAIL'.freeze

    class << self
      def services
        [:advisor, :vulnerabilities]
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
        # options[:headers] = { 'Correlation-ID' => request_id } if request_id
        client = RestClient::Resource.new(url, options)

        response = client.get
        response.empty? ? {} : JSON.parse(response).with_indifferent_access
      end

      def ping_service(service_name, service_result_hash)
        exception_watch(service_result_hash) do
          ping_url("https://ip-10-0-168-225.rhos-01.prod.psi.rdu2.redhat.com/insights_cloud/api/insights/v1/rule/?impacting=true")
        end
      end
    end
  end
end