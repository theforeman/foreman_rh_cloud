require 'rest-client'

module InsightsCloud
  module Async
    class InsightsRulesSync < ::Actions::EntryAction
      include ::ForemanRhCloud::CertAuth
      include ::ForemanRhCloud::Async::ExponentialBackoff

      def plan(organizations)
        # since the tasks are not connected, we need to force sequence execution here
        # to make sure we don't run resolutions until we synced all our rules
        sequence do
          plan_self(organization_ids: organizations.map(&:id))
          plan_resolutions
        end
      end

      def plan_resolutions
        plan_action InsightsResolutionsSync
      end

      def try_execute
        offset = 0
        InsightsRule.transaction do
          organizations.each do |organization|
            loop do
              api_response = query_insights_rules(offset, organization)
              results = RulesResult.new(api_response)
              logger.debug("Downloaded #{offset + results.count} of #{results.total}")
              write_rules_page(results.rules)
              offset += results.count
              output[:rules_count] = results.total
              break if offset >= results.total
            end
          end

          # Remove all rules that do not have hits associated with them
          cleanup_rules
        end
        done!
      end

      def logger
        action_logger
      end

      private

      def query_insights_rules(offset, organization)
        rules_response = execute_cloud_request(
          organization: organization,
          method: :get,
          url: InsightsCloud.rules_url(offset: offset)
        )

        JSON.parse(rules_response)
      end

      def write_rules_page(rules)
        rules_attributes = rules.map { |rule| to_rule_hash(rule) }

        InsightsRule.upsert_all(rules_attributes, unique_by: :rule_id) unless rules_attributes.empty?
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

      def cleanup_rules
        InsightsRule.left_outer_joins(:hits).where(insights_hits: { id: nil }).delete_all
      end

      def rescue_strategy_for_self
        Dynflow::Action::Rescue::Fail
      end

      def organizations
        @organizations ||= Organization.where(id: input[:organization_ids])
      end
    end
  end
end
