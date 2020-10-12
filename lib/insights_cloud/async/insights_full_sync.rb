require 'rest-client'

module InsightsCloud
  module Async
    class InsightsFullSync < ::ApplicationJob
      include ::ForemanRhCloud::CloudAuth

      def perform
        hits = query_insights_hits

        @hits_host_names = Hash[hits.map { |hit| [hit['hostname'], hit['uuid']] }]
        setup_host_names(@hits_host_names.keys)

        replace_hits_data(hits)
      end

      def logger
        Foreman::Logging.logger('background')
      end

      private

      def query_insights_hits
        hits_response = RestClient::Request.execute(
          method: :get,
          url: InsightsCloud.hits_export_url,
          verify_ssl: ForemanRhCloud.verify_ssl_method,
          proxy: ForemanRhCloud.transformed_http_proxy_string(logger: logger),
          headers: {
            Authorization: "Bearer #{rh_credentials}",
          }
        )

        JSON.parse(hits_response)
      end

      def setup_host_names(host_names)
        @host_ids = Hash[
          Host.unscoped.where(name: host_names).pluck(:name, :id)
        ]
      end

      def host_id(host_name)
        @host_ids[host_name]
      end

      def replace_hits_data(hits)
        InsightsHit.transaction do
          InsightsHit.delete_all
          InsightsHit.create(hits.map { |hits_hash| to_model_hash(hits_hash) }.compact)
          # create new facets for hosts that are missing one
          hosts_with_existing_facets = InsightsFacet.where(host_id: @host_ids.values).pluck(:host_id)
          InsightsFacet.create(
            @host_ids.map do |host_name, host_id|
              unless hosts_with_existing_facets.include?(host_id)
                {
                  host_id: host_id,
                  uuid: @hits_host_names[host_name],
                }
              end
            end.compact
          )
        end
      end

      def to_model_hash(hit_hash)
        hit_host_id = host_id(hit_hash['hostname'])

        return unless hit_host_id

        {
          host_id: hit_host_id,
          last_seen: Time.parse(hit_hash['last_seen']),
          publish_date: Time.parse(hit_hash['publish_date']),
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
