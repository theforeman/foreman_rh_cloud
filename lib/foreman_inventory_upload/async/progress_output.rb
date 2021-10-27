module ForemanInventoryUpload
  module Async
    class ProgressOutput
      def self.get(label)
        ProgressOutput.new(label, :reader)
      end

      def self.register(label)
        TaskOutputLine.where(label: @label).delete_all
        ProgressOutput.new(label, :writer)
      end

      def initialize(label, mode)
        @label = label
        @mode = mode
      end

      def full_output
        TaskOutputLine.where(label: @label).order(:created_at).pluck(:line).join("\n")
      end

      def write_line(line)
        TaskOutputLine.create!(label: @label, line: line)
      end

      def close
      end

      def status
        TaskOutputStatus.where(label: @label).pluck(:status).first || ''
      end

      def status=(status)
        TaskOutputStatus.upsert({ label: @label, status: status }, unique_by: :label)
      end
    end
  end
end
