require 'rest-client'

module InsightsCloud
  module Async
    class InsightsRulesSync < ::ApplicationJob
      include ::ForemanRhCloud::CloudAuth

      def perform
        offset = 0
        InsightsRule.transaction do
          InsightsResolution.delete_all
          InsightsRule.delete_all
          loop do
            api_response = query_insights_rules(offset)
            results = RulesResult.new(api_response)
            logger.debug("Downloaded #{offset + results.count} of #{results.total}")
            write_rules_page(results.rules)
            offset += results.count
            break if offset >= results.total
          end
        end
      end

      def logger
        Foreman::Logging.logger('background')
      end

      private

      def query_insights_rules(offset)
        rules_response = RestClient::Request.execute(
          method: :get,
          url: InsightsCloud.rules_url(offset: offset),
          verify_ssl: ForemanRhCloud.verify_ssl_method,
          proxy: ForemanRhCloud.transformed_http_proxy_string(logger: logger),
          headers: {
            Authorization: "Bearer #{rh_credentials}",
          }
        )

        JSON.parse(rules_response)
      end

      def write_rules_page(rules)
        rules_attributes = rules.map { |rule| to_rule_hash(rule) }
        resolutions_attributes = rules.map do |rule|
          rule['resolution_set'].map { |resolution| to_resolution_hash(rule['rule_id'], resolution) }
        end.flatten

        InsightsRule.create(rules_attributes)
        InsightsResolution.create(resolutions_attributes)
      end

      def to_rule_hash(rule_hash)
        {
          rule_id: rule_hash['rule_id'],
          description:  rule_hash['description'],
          category_name:  rule_hash.dig('category', 'name'),
          impact_name:  rule_hash.dig('impact', 'name'),
          summary:  rule_hash['summary'],
          generic:  rule_hash['generic'],
          reason:  rule_hash['reason'],
          total_risk:  rule_hash['total_risk'],
          reboot_required:  rule_hash['reboot_required'],
          more_info:  rule_hash['more_info'],
          rating:  rule_hash['rating'],
        }
      end

      def to_resolution_hash(rule_id, resolution_hash)
        {
          rule_id: rule_id,
          system_type: resolution_hash['system_type'],
          resolution: resolution_hash['resolution'],
          has_playbook: resolution_hash['has_playbook'],
        }
      end
    end
  end
end
