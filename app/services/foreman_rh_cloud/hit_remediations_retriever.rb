module ForemanRhCloud
  class HitRemediationsRetriever < RemediationsRetriever
    def initialize(hit_remediation_pairs, logger: Logger.new(IO::NULL))
      super(logger: logger)
      @is_iop = ForemanRhCloud.with_local_advisor_engine?
      @hit_remediation_pairs = (hit_remediation_pairs || {}).map(&:with_indifferent_access)
      logger.debug("Querying playbook for #{hit_remediation_pairs}")
    end

    private

    def hit_ids # hit_ids are host ids
      @hit_remediation_pairs.map { |pair| pair["hit_id"] }
    end

    def remediation_ids
      # In IoP, these are Insights rule IDs. For Hosted, they are Foreman database IDs
      @hit_remediation_pairs.map { |pair| pair["resolution_id"] }
    end

    def hits
      if @is_iop
        # Return the hit_id unaltered. With IoP, host ids are already translated
        @hits = Hash[@hit_remediation_pairs.map { |pair| [pair[:hit_id], pair[:hit_id]] }]
      else
        # Return a hash which maps Foreman host ID to Insights-flavored ID
        @hits ||= Hash[
          InsightsHit.joins(:insights_facet).where(id: hit_ids).pluck(:id, 'insights_facets.uuid')
        ]
      end
      @hits
    end

    def pairs_by_remediation_id
      @hit_remediation_pairs.group_by { |pair| pair["resolution_id"] }
    end

    def remediations
      if @is_iop
        @remediations = Hash[
          @hit_remediation_pairs.map { |pair| [pair['resolution_id'], { resolution_type: pair['resolution_type'], rule_id: pair['rule_id'] }] }
        ]
      else
        @remediations ||= Hash[
          InsightsResolution.where(id: remediation_ids).pluck(:id, :resolution_type, :rule_id).map do |id, resolution_type, rule_id|
            [id, { resolution_type: resolution_type, rule_id: rule_id }]
          end
        ]
      end
      @remediations
    end

    # def iop_playbook_request
    #   {
    #     issues: pairs_by_remediation_id.flat_map do |resolution_type, pairs|
    #       pairs.map do |pair|
    #         {
    #           resolution: resolution_type,
    #           id: "advisor:#{pair[:hit_id]}",
    #           systems: iop_system_ids
    #         }
    #       end
    #     end
    #   }
    # end

    # def iop_system_ids
    #   @host_insights_ids.present? ? @host_insights_ids.split(',') : ''
    # end

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
      @is_iop ? Organization.current : InsightsHit.find(@hit_remediation_pairs.first['hit_id']).host.organization
    end
  end
end
