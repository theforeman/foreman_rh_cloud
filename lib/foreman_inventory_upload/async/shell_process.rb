require 'open3'

module ForemanInventoryUpload
  module Async
    class ShellProcess < ::Actions::EntryAction
      include AsyncHelpers
      include ::ForemanRhCloud::Async::ExponentialBackoff

      def plan(instance_label, more_inputs = {})
        inputs = more_inputs.merge(instance_label: instance_label)
        plan_self(inputs)
      end

      def try_execute
        klass_name = self.class.name
        logger.debug("Starting #{klass_name} with label #{instance_label}")
        progress_output do |progress_output|
          Open3.popen2e(hash_to_s(env), *preprocess_command(command)) do |_stdin, stdout_stderr, wait_thread|
            progress_output.status = "Running in pid #{wait_thread.pid}"

            stdout_stderr.each do |out_line|
              progress_output.write_line(out_line)
            end

            progress_output.status = wait_thread.value.to_s
          end
        end
        logger.debug("Finished job #{klass_name} with label #{instance_label}")

        assert_task_status(ProgressOutput.get(instance_label).status)
        done!
      end

      def command
      end

      def progress_output
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

      def rescue_strategy_for_self
        Dynflow::Action::Rescue::Fail
      end

      private

      def preprocess_command(command)
        command.kind_of?(Array) ? command : [command]
      end

      def instance_label
        input[:instance_label]
      end

      def assert_task_status(status)
        raise Foreman::Exception.new('Process exited with an unknown status: %{status}', status: status) unless status.match?(/pid \d+ exit 0/)
      end
    end
  end
end
