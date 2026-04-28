module ForemanRhCloud
  class URLRemediationsRetriever < RemediationsRetriever
    attr_reader :url, :headers

    def initialize(url:, organization_id:, payload: '', headers: {}, logger: Logger.new(IO::NULL))
      super(logger: logger)

      parsed_url = URI.parse(url)
      query_params = parsed_url.query ? CGI.parse(parsed_url.query) : {}
      hosts_param = query_params.delete('hosts')

      if hosts_param.present?
        @host_uuids = hosts_param.flat_map { |v| v.split(',') }.map(&:strip).reject(&:blank?)
        @host_uuids = nil if @host_uuids.empty?
        parsed_url.query = query_params.any? ? URI.encode_www_form(query_params) : nil
        @url = parsed_url.to_s
      else
        @host_uuids = nil
        @url = url
      end

      @payload = payload
      @headers = headers
      @organization_id = organization_id
    end

    private

    def query_playbook
      logger.debug("Querying playbook via #{method.to_s.upcase} at: #{url} with payload: #{payload} and headers: #{headers}")

      super
    end

    def playbook_url
      @url
    end

    def headers
      super.deep_merge(@headers)
    end

    def payload
      return @host_uuids.to_json if @host_uuids.present?
      @payload.present? ? @payload.to_json : @payload
    end

    def method
      @host_uuids.present? ? :post : :get
    end

    def organization
      Organization.find(@organization_id)
    end
  end
end
