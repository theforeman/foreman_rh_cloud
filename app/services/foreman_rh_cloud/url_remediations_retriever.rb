module ForemanRhCloud
  class URLRemediationsRetriever < RemediationsRetriever
    attr_reader :url, :payload, :headers

    def initialize(url:, organization_id:, payload: '', headers: {}, logger: Logger.new(IO::NULL))
      super(logger: logger)

      @url = url
      @payload = payload
      @headers = headers
      @organization_id = organization_id
    end

    private

    def query_playbook
      logger.debug("Querying playbook at: #{url} with payload: #{payload} and headers: #{headers}")

      super
    end

    def playbook_url
      @url
    end

    def headers
      super.deep_merge(@headers)
    end

    def payload
      @payload.to_json
    end

    def method
      :get
    end

    def organization
      Organization.find(@organization_id)
    end
  end
end
