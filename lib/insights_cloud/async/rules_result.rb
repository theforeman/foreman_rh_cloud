module InsightsCloud
  module Async
    class RulesResult
      attr_reader :rules, :count, :total

      def initialize(result)
        @total = result.dig('meta', 'count')
        @count = result['data'].length
        @rules = result['data']
      end
    end
  end
end
