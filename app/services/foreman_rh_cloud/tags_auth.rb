module ForemanRhCloud
  class TagsAuth
    include GatewayRequest

    TAG_NAMESPACE = 'sat_iam'.freeze
    TAG_SHORT_NAME = 'user'.freeze
    TAG_NAME = "#{TAG_NAMESPACE}/#{TAG_SHORT_NAME}".freeze

    def self.auth_tag_for(user)
      new(user, nil).auth_tag
    end

    attr_reader :logger

    def initialize(user, logger)
      @user = user
      @logger = logger
    end

    def update_tag
      logger.debug("Updating tags for user: #{@user}")

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
      Host.authorized_as(@user, nil, nil).joins(:subscription_facet).pluck('katello_subscription_facets.uuid')
    end

    def tags_query_payload
      {
        tags: [{ "namespace": TAG_NAMESPACE, "key": TAG_SHORT_NAME, "value": tag_value }],
        host_id_list: allowed_hosts,
      }
    end

    def tag_value
      @user.login
    end

    def auth_tag
      "#{TAG_NAME}=#{tag_value}"
    end
  end
end
