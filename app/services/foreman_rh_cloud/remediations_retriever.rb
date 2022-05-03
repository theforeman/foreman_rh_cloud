module ForemanRhCloud
  class RemediationsRetriever
    include CertAuth

    attr_reader :logger

    def initialize(logger: Logger.new(IO::NULL))
      @logger = logger
      @organization = InsightsHit.find(hit_remediation_pairs.first['hit_id']).host.organization

      logger.debug("Querying playbook for #{hit_remediation_pairs}")
    end

    def create_playbook
      unless cert_auth_available?(@organization)
        logger.debug('Manifest is not available, cannot continue')
        return
      end

      response = query_playbook

      logger.debug("Got playbook response: #{response.body}")

      response.body
    end

    private

    def query_playbook
      execute_cloud_request(
        method: method,
        url: playbook_url,
        headers: headers,
        payload: payload
      )
    end

    def playbook_url
    end

    def headers
      {
        content_type: :json,
      }
    end

    def payload
    end

    def method
      :get
    end

    def query_playbook
      execute_cloud_request(
        organization: @organization,
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
