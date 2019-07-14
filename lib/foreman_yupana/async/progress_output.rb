module ForemanYupana
  module Async
    class ProgressOutput
      def self.registry
        @registry ||= {}
      end

      def self.register(label)
        registry[label] = ProgressOutput.new
      end

      def buffer
        @buffer ||= ['']
      end

      def full_output
        buffer.join
      end

      def write_line(line)
        buffer << line
      end
    end
  end
end
