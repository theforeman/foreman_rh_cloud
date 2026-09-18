module ForemanRhCloud
  class TagsAuth
    include CertAuth

    TAG_NAMESPACE = 'sat_iam'.freeze
    TAG_SHORT_NAME = 'scope'.freeze
    TAG_NAME = "#{TAG_NAMESPACE}/#{TAG_SHORT_NAME}".freeze
    SYNC_CACHE_TTL = 10.seconds

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
      cached = Rails.cache.read(sync_cache_key)
      return cached if cached

      Foreman::AdvisoryLockManager.with_session_lock(sync_lock_name) do
        Rails.cache.fetch(sync_cache_key, expires_in: SYNC_CACHE_TTL) do
          loc_name = location_name_for_tag
          logger.debug("Updating tags for user: #{@user}, org: #{@org.name}, loc: #{loc_name}")

          payload = tags_query_payload
          params = {
            organization: @org,
            method: :post,
            url: "#{InsightsCloud.gateway_url}/tags",
            headers: {
              content_type: :json,
            },
            payload: payload.to_json,
          }
          execute_cloud_request(params) unless payload[:host_id_list].empty?
          true
        end
      end
    end

    def allowed_hosts
      query = Host.authorized_as(@user, nil, nil).where(organization: @org)
      query = query.where(location: @loc) if @loc
      query.joins(:subscription_facet).pluck('katello_subscription_facets.uuid')
    end

    def tags_query_payload
      {
        tags: [{ "namespace": TAG_NAMESPACE, "key": TAG_SHORT_NAME, "value": tag_value }],
        host_id_list: allowed_hosts,
      }
    end

    def tag_value
      location_part = "L:\"#{location_name_for_tag}\""
      "U:\"#{@user.login}\"O:\"#{@org.name}\"#{location_part}"
    end

    def auth_tag
      "#{TAG_NAME}=#{tag_value}"
    end

    private

    def location_name_for_tag
      @loc ? @loc.name : '*'
    end

    def sync_cache_key
      ['rh_cloud_tags_auth_sync', @user, @org, @loc].compact
    end

    def sync_lock_name
      [@user, @org, @loc].compact.map(&:cache_key).join('/')
    end
  end
end
