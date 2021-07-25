module ForemanRhCloud
  class RemediationsRetriever
    include CloudAuth

    attr_reader :logger

    def initialize(hit_remediation_pairs, logger: Logger.new(IO::NULL))
      @hit_remediation_pairs = hit_remediation_pairs
      @logger = logger

      logger.debug("Querying playbook for #{hit_remediation_pairs}")
    end

    def create_playbook
      unless cloud_auth_available?
        logger.debug('Cloud authentication is not available, cannot continue')
        return nil
      end

      response = query_playbook

      logger.debug("Got playbook response: #{response.body}")

      response.body
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
              hits[pair["hit_id"]]
            end,
          }
        end,
      }
    end

    def query_playbook
      execute_cloud_request(
        method: :post,
        url: InsightsCloud.playbook_url,
        headers: {
          content_type: :json,
        },
        payload: playbook_request.to_json
      )
    end
  end
end
