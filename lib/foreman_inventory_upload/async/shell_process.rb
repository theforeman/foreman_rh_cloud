require 'open3'

module ForemanInventoryUpload
  module Async
    class ShellProcess < ::ApplicationJob
      include AsyncHelpers

      def perform(instance_label)
        klass_name = self.class.name
        logger.debug("Starting #{klass_name} with label #{instance_label}")
        progress_output_for(instance_label) do |progress_output|
          Open3.popen2e(hash_to_s(env), command) do |_stdin, stdout_stderr, wait_thread|
            progress_output.status = "Running in pid #{wait_thread.pid}"

            stdout_stderr.each do |out_line|
              progress_output.write_line(out_line)
            end

            progress_output.status = wait_thread.value.to_s
          end
        end
        logger.debug("Finished job #{klass_name} with label #{instance_label}")
      end

      def command
      end

      def progress_output_for(instance_label)
        progress_output = ProgressOutput.register(instance_label)
        yield(progress_output)
      ensure
        progress_output.close
      end

      def env
        {}
      end

      def logger
        Foreman::Logging.logger('background')
      end
    end
  end
end
