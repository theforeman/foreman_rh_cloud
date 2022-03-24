module InsightsCloud
  module Generators
    class PlaybookProgressGenerator
      attr_reader :correlation_id
      def initialize(correlation_id)
        @messages = []
        @correlation_id = correlation_id
      end

      def host_progress_message(host_name, output, sequence)
        @messages << {
          "type": "playbook_run_update",
          "version": 3,
          "correlation_id": correlation_id,
          "sequence": sequence,
          "host": host_name,
          "console": output,
        }
      end

      def host_finished_message(host_name, exit_code)
        @messages << {
          "type": "playbook_run_finished",
          "version": 3,
          "correlation_id": correlation_id,
          "host": host_name,
          "status": exit_code == 0 ? 'success' : 'failure',
          "connection_code": 0,
          "execution_code": exit_code,
        }
      end

      def job_finished_message
        @messages << {
          "type": "playbook_run_completed",
          "version": 3,
          "correlation_id": correlation_id,
          "status": "success",
        }
      end

      def generate
        @messages.map do |message|
          message.to_json
        end.join("\n")
      end
    end
  end
end
