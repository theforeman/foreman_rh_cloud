module ForemanRhCloud
  class UrlRemediationsRetriever < RemediationsRetriever
    attr_reader :url, :payload, :headers

    def initialize(url:, payload: '', headers: {}, logger: Logger.new(IO::NULL))
      super(logger: logger)

      @url = url
      @payload = payload
      @headers = headers
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
  end
end
