require 'rest-client'

module InsightsCloud
  module Async
    class InsightsFullSync < ::ApplicationJob
      def perform(organization)
        @organization = organization

        hits = query_insights_hits

        host_names = hits.map { |hit| hit['hostname'] }.uniq
        setup_host_names(host_names)

        replace_hits_data(hits)
      end

      def logger
        Foreman::Logging.logger('background')
      end

      def rh_credentials
        @rh_credentials ||= query_refresh_token
      end

      private

      def query_insights_hits
        hits_response = RestClient::Request.execute(
          method: :get,
          url: InsightsCloud.hits_export_url,
          verify_ssl: ENV['SATELLITE_INSIGHTS_CLOUD_URL'] ? OpenSSL::SSL::VERIFY_NONE : OpenSSL::SSL::VERIFY_PEER,
          headers: {
            Authorization: "Bearer #{rh_credentials}"
          }
        )

        JSON.parse(hits_response)
      end

      def query_refresh_token
        token_response = RestClient::Request.execute(
          method: :post,
          url: InsightsCloud.authentication_url,
          verify_ssl: ENV['SATELLITE_INSIGHTS_CLOUD_URL'] ? OpenSSL::SSL::VERIFY_NONE : OpenSSL::SSL::VERIFY_PEER,
          payload: {
            grant_type: 'refresh_token',
            client_id: 'rhsm-api',
            refresh_token: Setting[:rh_cloud_token]
          }
        )

        JSON.parse(token_response)['access_token']
      end

      def setup_host_names(host_names)
        @host_ids = Hash[
          Host.where(name: host_names).pluck(:name, :id)
        ]
      end

      def host_id(host_name)
        @host_ids[host_name]
      end

      def replace_hits_data(hits)
        InsightsHit.transaction do
          InsightsHit.delete_all
          InsightsHit.create(hits.map { |hits_hash| to_model_hash(hits_hash) })
          InsightsFacet.create(@host_ids.values.map { |id| {host_id: id} })
        end
      end

      def to_model_hash(hit_hash)
        {
          host_id: host_id(hit_hash['hostname']),
          last_seen: DateTime.parse(hit_hash['last_seen']),
          publish_date: DateTime.parse(hit_hash['publish_date']),
          title: hit_hash['title'],
          solution_url: hit_hash['solution_url'],
          total_risk: hit_hash['total_risk'].to_i,
          likelihood: hit_hash['likelihood'].to_i,
          results_url: hit_hash['results_url'],
        }
      end
    end
  end
end
