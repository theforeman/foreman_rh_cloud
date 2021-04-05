require 'rest-client'

module InsightsCloud
  module Async
    class InsightsResolutionsSync < ::Actions::EntryAction
      include ::ForemanRhCloud::CloudAuth

      RULE_ID_REGEX = /[^:]*:(?<id>.*)/

      def run
        InsightsResolution.transaction do
          InsightsResolution.delete_all
          api_response = query_insights_resolutions(relevant_rules)
          write_resolutions(api_response)
        end
      end

      def logger
        action_logger
      end

      private

      def query_insights_resolutions(rule_ids)
        resolutions_response = RestClient::Request.execute(
          method: :post,
          url: InsightsCloud.resolutions_url,
          verify_ssl: ForemanRhCloud.verify_ssl_method,
          proxy: ForemanRhCloud.transformed_http_proxy_string(logger: logger),
          headers: {
            content_type: :json,
            Authorization: "Bearer #{rh_credentials}",
          },
          payload: {
            issues: rule_ids,
          }.to_json
        )

        JSON.parse(resolutions_response)
      end

      def relevant_rules
        InsightsRule.all.pluck(:rule_id).map { |id| "advisor:#{id}" }
      end

      def to_resolution_hash(rule_id, resolution_hash)
        {
          rule_id: rule_id,
          description: resolution_hash['description'],
          resolution_type: resolution_hash['id'],
          needs_reboot: resolution_hash['needs_reboot'],
          resolution_risk: resolution_hash['resolution_risk'],
        }
      end

      def write_resolutions(response)
        all_resolutions = response.map do |rule_id, rule_details|
          rule_details['resolutions'].map { |resolution| to_resolution_hash(to_rule_id(rule_id), resolution) }
        end.flatten

        InsightsResolution.create(all_resolutions)
      end

      def to_rule_id(resolution_rule_id)
        RULE_ID_REGEX.match(resolution_rule_id).named_captures.fetch('id', resolution_rule_id)
      end
    end
  end
end
