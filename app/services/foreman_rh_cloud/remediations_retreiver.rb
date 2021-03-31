module ForemanRhCloud
  class RemediationsRetreiver
    include CloudAuth

    def initialize(hit_remediation_pairs, logger: nil)
      @hit_remediation_pairs = hit_remediation_pairs
      @logger = logger
    end

    def create_playbook
      query_playbook
    end

    private

    def hit_ids
      @hit_remediation_pairs.map { |pair| pair[:hit_id] }
    end

    def remediation_ids
      @hit_remediation_pairs.map { |pair| pair[:remediation_id] }
    end

    def hits
      @hits ||= Hash[
        InsightsHit.joins(:insights_facet).where(id: hit_ids).pluck(:id, 'insights_facets.uuid')
      ]
    end

    def pairs_by_remediation_id
      @hit_remediation_pairs.group_by { |pair| pair[:remediation_id] }
    end

    def remediations
      @remediations ||= Hash[
        InsightsResolution.where(id: remediation_ids).pluck(:id, :resolution_type, :rule_id).map do |id, resolution_type, rule_id|
          [id, {resolution_type: resolution_type, rule_id: rule_id}]
        end
      ]
    end

    def playbook_request
      {
        issues: pairs_by_remediation_id.map do |remediation_id, pairs|
            {
              resolution: remediations[remediation_id][:resolution_type],
              id: InsightsCloud.remediation_rule_id(remediations[remediation_id][:rule_id]),
              systems: pairs.map do |pair|
                hits[pair[:hit_id]]
              end,
            }
        end
      }
    end

    def query_playbook
      playbook_response = RestClient::Request.execute(
        method: :post,
        url: InsightsCloud.playbook_url,
        verify_ssl: ForemanRhCloud.verify_ssl_method,
        proxy: ForemanRhCloud.transformed_http_proxy_string(logger: logger),
        headers: {
          content_type: :json,
          Authorization: "Bearer #{rh_credentials}",
        },
        payload: playbook_request.to_json
      )
    end

    def logger
      @logger
    end
  end
end
