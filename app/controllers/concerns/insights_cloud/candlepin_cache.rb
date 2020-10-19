module InsightsCloud
  module CandlepinCache
    extend ActiveSupport::Concern

    def upstream_owner(org)
      # We use a cache because owner_details is a call to Candlepin
      Rails.cache.fetch("rh_cloud_upstream_owner_#{org.id}", expires_in: 1.minute) do
        org.owner_details['upstreamConsumer']
      end
    end

    def cp_owner_id(org)
      owner = upstream_owner(org)
      owner['uuid'] if owner
    end
  end
end
