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

    def candlepin_id_cert(org)
      owner = upstream_owner(org)
      return unless owner
      id_cert = {
        cert: owner.dig('idCert', 'cert'),
        key: owner.dig('idCert', 'key'),
      }
      return unless id_cert.values.all?
      id_cert
    end
  end
end
