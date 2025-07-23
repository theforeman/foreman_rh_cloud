module ForemanRhCloud
  class Ping
    OK_RETURN_CODE = 'ok'.freeze
    FAIL_RETURN_CODE = 'FAIL'.freeze

    class << self
      def services
        [:insights]
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
          ping_service(result[service])
        end

        # set overall status result code
        result = {:services => result}
        result[:status] = result[:services].each_value.any? { |v| v[:status] == FAIL_RETURN_CODE } ? FAIL_RETURN_CODE : OK_RETURN_CODE
        result
      end

      def ping_service(service_result)
        exception_watch(service_result) do
          puts "hi"
        end
      end
    end
  end
end