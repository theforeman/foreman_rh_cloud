module ForemanInventoryUpload
  module Generators
    class JsonStream
      attr_reader :out

      def initialize(out)
        @out = out
      end

      def array
        @out << '['
        yield
        @out << ']'
      end

      def object
        @out << '{'
        yield
        @out << '}'
      end

      def comma
        @out << ', '
      end

      def raw(string)
        @out << string
      end

      def simple_field(name, value, last = false, &block)
        return if value.nil? || value.try(:empty?)
        return if value.kind_of?(Array) && value.compact.empty?

        block ||= ->(value) { value }

        @out << "\"#{name}\": #{stringify_value(block.call(value))}#{last ? '' : ','}"
      end

      def array_field(name, last = false, &block)
        @out << "\"#{name}\": "
        array(&block)
        @out << ',' unless last
      end

      def string_array_value(name, value, last = false)
        return if value.empty?

        string_value = value.map { |v| stringify_value(v) }

        array_field(name, last) do
          raw(string_value.join(', '))
        end
      end

      def object_field(name, last = false, &block)
        @out << "\"#{name}\": "
        object(&block)
        @out << ',' unless last
      end

      def stringify_value(value)
        return value if value.is_a?(Integer)
        return value if value.is_a?(TrueClass)
        return value if value.is_a?(FalseClass)
        return value.to_json if value.is_a?(Hash)

        ActiveSupport::JSON.encode(value)
      end
    end
  end
end
