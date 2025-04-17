module ForemanRhCloud
  class RemediationsRetriever
    include CertAuth

    attr_reader :logger

    def initialize(logger: Logger.new(IO::NULL))
      @logger = logger
    end

    def add_bootc_requirements_to_playbook(playbook)
      playbook_yaml = YAML.load(playbook)
      hosts = playbook_yaml[0]["hosts"]
      # Assumption: hosts will always return a single host
      # Question: is there another way to get the target host?
      host = Host.find_by(hostname: hosts.first)
      if host.respond_to?(:image_mode_host?) && host.image_mode_host?
        usr_overlay_play = { "name" => "enable bootc usr-overlay",
                             "hosts" => hosts,
                             "become" => true,
                             "tasks" => [{ "name" => "enable bootc usr-overlay",
                                           "command" => "bootc usr-overlay",
                                           "register" => "insights_result",
                                           "ignore_errors" => true }] }
        playbook_yaml.prepend(usr_overlay_play)
        return playbook_yaml.to_yaml
      else
        return playbook
      end
    end

    def create_playbook
      unless cert_auth_available?(organization)
        logger.debug('Manifest is not available, cannot continue')
        return
      end

      response = query_playbook

      logger.debug("Got playbook response: #{response.body}")

      add_bootc_requirements_to_playbook(response.body)
    end

    private

    def query_playbook
      execute_cloud_request(
        organization: organization,
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

    def organization
    end
  end
end
