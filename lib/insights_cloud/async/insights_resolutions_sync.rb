require 'rest-client'

module InsightsCloud
  module Async
    class InsightsResolutionsSync < ::Actions::EntryAction
      include ::ForemanRhCloud::CertAuth
      include ::ForemanRhCloud::Async::ExponentialBackoff

      RULE_ID_REGEX = /[^:]*:(?<id>.*)/

      def try_execute
        InsightsResolution.transaction do
          InsightsResolution.delete_all
          rule_ids = relevant_rules
          Organization.all.each do |organization|
            next if !cert_auth_available?(organization) || organization.manifest_expired?
            api_response = query_insights_resolutions(rule_ids, organization) unless rule_ids.empty?
            written_rules = write_resolutions(api_response) if api_response
            rule_ids -= Array(written_rules)
          end
        end
        done!
      end

      def logger
        action_logger
      end

      private

      def query_insights_resolutions(rule_ids, organization)
        resolutions_response = execute_cloud_request(
          organization: organization,
          method: :post,
          url: InsightsCloud.resolutions_url,
          headers: {
            content_type: :json,
          },
          payload: {
            issues: rule_ids,
          }.to_json
        )

        JSON.parse(resolutions_response)
      end

      def relevant_rules
        InsightsRule.all.pluck(:rule_id).map { |id| InsightsCloud.remediation_rule_id(id) }
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
          if rule_details
            rule_details['resolutions'].map { |resolution| to_resolution_hash(to_rule_id(rule_id), resolution) }
          else
            logger.info("Rules response: #{rule_id} #{rule_details}")
            logger.debug("Response: #{response}\n Failed id #{rule_id}")
            []
          end
        end.flatten

        InsightsResolution.create(all_resolutions)
        response.keys
      end

      def to_rule_id(resolution_rule_id)
        RULE_ID_REGEX.match(resolution_rule_id).named_captures.fetch('id', resolution_rule_id)
      end

      def rescue_strategy_for_self
        Dynflow::Action::Rescue::Fail
      end
    end
  end
end
