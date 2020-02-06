module ForemanInventoryUpload
  module Generators
    module FactHelpers
      extend ActiveSupport::Concern

      def fact_value(host, fact_name)
        value_record = host.fact_values.find do |fact_value|
          fact_value.fact_name_id == ForemanInventoryUpload::Generators::Queries.fact_names[fact_name]
        end
        value_record&.value
      end

      def kilobytes_to_bytes(kilobytes)
        kilobytes * 1024
      end
    end
  end
end
