module ForemanYupana
  module Async
    class ProgressOutput
      def self.get(label)
        ProgressOutput.new(label, :reader)
      end

      def self.register(label)
        ProgressOutput.new(label, :writer)
      end

      def initialize(label, mode)
        @label = label
        @mode = mode
      end

      def buffer
        @buffer ||= File.open(@label, file_mode)
      end

      def full_output
        buffer.read
      end

      def write_line(line)
        buffer << line
      end

      def close
        @buffer&.close
      end

      def status
        File.read(file_name(:status))
      end

      def status=(status)
        File.atomic_write(file_name(:status)) do |status_file|
          status_file.write(status)
        end
      end

      private

      def file_mode
        @mode == :reader ? 'r' : 'w'
      end

      def file_name(type = 'out')
        File.join(ForemanYupana.outputs_folder, "#{@label}.#{type}")
      end
    end
  end
end
