module ForemanRhCloud
  class RemediationsRetriever
    include CloudAuth

    attr_reader :logger

    def initialize(logger: Logger.new(IO::NULL))
      @logger = logger
    end

    def create_playbook
      unless cloud_auth_available?
        logger.debug('Cloud authentication is not available, cannot continue')
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
  end
end
