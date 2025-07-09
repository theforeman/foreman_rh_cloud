module ForemanRhCloud
  class TagsAuth
    include GatewayRequest

    TAG_NAMESPACE = 'sat_iam'.freeze
    TAG_SHORT_NAME = 'scope'.freeze
    TAG_NAME = "#{TAG_NAMESPACE}/#{TAG_SHORT_NAME}".freeze

    def self.auth_tag_for(user, org, loc)
      new(user, org, loc, nil).auth_tag
    end

    attr_reader :logger

    def initialize(user, org, loc, logger)
      @user = user
      @org = org
      @loc = loc
      @logger = logger
    end

    def update_tag
      logger.debug("Updating tags for user: #{@user}, org: #{@org.name}, loc: #{@loc.name}")

      params = {
        method: :post,
        url: "#{InsightsCloud.gateway_url}/tags",
        headers: {
          content_type: :json,
        },
        payload: tags_query_payload.to_json,
      }
      execute_cloud_request(params)
    end

    def allowed_hosts
      Host.authorized_as(@user, nil, nil).where(organization: @org, location: @loc).joins(:subscription_facet).pluck('katello_subscription_facets.uuid')
    end

    def tags_query_payload
      {
        tags: [{ "namespace": TAG_NAMESPACE, "key": TAG_SHORT_NAME, "value": tag_value }],
        host_id_list: allowed_hosts,
      }
    end

    def tag_value
      "U:\"#{@user.login}\"O:\"#{@org.name}\"L:\"#{@loc.name}\""
    end

    def auth_tag
      "#{TAG_NAME}=#{tag_value}"
    end
  end
end
