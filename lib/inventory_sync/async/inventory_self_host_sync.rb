module InventorySync
  module Async
    class InventorySelfHostSync < QueryInventoryJob
      set_callback :step, :around, :create_facets

      def plan
        host = ForemanRhCloud.foreman_host

        if host.nil?
          logger.warn("Skipping self-host inventory sync: no Foreman host record found.")
          return
        end

        super(host.organization)
      end

      def create_facets
        # get the results from the event
        results = yield

        add_missing_insights_facet(results.uuid_by_fqdn) unless results.uuid_by_fqdn.empty?
        results
      end

      def rescue_strategy_for_self
        Dynflow::Action::Rescue::Fail
      end

      private

      def add_missing_insights_facet(uuids_hash)
        host = ForemanRhCloud.foreman_host
        return unless host # Guard against nil

        facet = InsightsFacet.find_or_create_by(host_id: host.id) do |facet|
          facet.uuid = uuids_hash.values.first
        end

        # fix empty uuid in case the facet already exists
        facet.update(uuid: uuids_hash.values.first) unless facet.uuid
      end

      def request_url
        ForemanInventoryUpload.inventory_self_url
      end

      def action_name
        'self host sync'
      end
    end
  end
end
