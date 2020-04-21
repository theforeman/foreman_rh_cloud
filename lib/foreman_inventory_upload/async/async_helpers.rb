module ForemanInventoryUpload
  module Async
    module AsyncHelpers
      extend ActiveSupport::Concern

      def hash_to_s(hash)
        hash.each_with_object({}) do |(k, v), a|
          a[k.to_s] = v.to_s
        end
      end
    end
  end
end
