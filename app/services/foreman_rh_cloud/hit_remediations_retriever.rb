module ForemanRhCloud
  class HitRemediationsRetriever < RemediationsRetriever
    def initialize(hit_remediation_pairs, logger: Logger.new(IO::NULL))
      super(logger: logger)
      @hit_remediation_pairs = hit_remediation_pairs
      logger.debug("Querying playbook for #{hit_remediation_pairs}")
    end

    private

    def hit_ids
      @hit_remediation_pairs.map { |pair| pair["hit_id"] }
    end

    def remediation_ids
      @hit_remediation_pairs.map { |pair| pair["resolution_id"] }
    end

    def hits
      @hits ||= Hash[
        InsightsHit.joins(:insights_facet).where(id: hit_ids).pluck(:id, 'insights_facets.uuid')
      ]
    end

    def pairs_by_remediation_id
      @hit_remediation_pairs.group_by { |pair| pair["resolution_id"] }
    end

    def remediations
      @remediations ||= Hash[
        InsightsResolution.where(id: remediation_ids).pluck(:id, :resolution_type, :rule_id).map do |id, resolution_type, rule_id|
          [id, { resolution_type: resolution_type, rule_id: rule_id }]
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
              hits[pair["hit_id"]]
            end,
          }
        end,
      }
    end

    def playbook_url
      InsightsCloud.playbook_url
    end

    def headers
      super
    end

    def payload
      playbook_request.to_json
    end

    def method
      :post
    end

    def organization
      InsightsHit.find(@hit_remediation_pairs.first['hit_id']).host.organization
    end
  end
end
