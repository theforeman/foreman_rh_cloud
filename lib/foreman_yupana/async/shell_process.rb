require 'open3'

module ForemanYupana
  module Async
    class ShellProcess
      include SuckerPunch::Job

      def perform(instance_label)
        SuckerPunch.logger.debug("Starting #{self.class.name} with label #{instance_label}")
        progress_output = ProgressOutput.register(instance_label)
        Open3.popen2e(env, cmd) do |_stdin, stdout_stderr, _wait_thread|
          stdout_stderr.each do |out_line|
            progress_output.write_line(out_line)
          end
        end
        SuckerPunch.logger.debug("Finished job #{self.class.name} with label #{instance_label}")
      end

      def command; end

      def env
        {}
      end
    end
  end
end
