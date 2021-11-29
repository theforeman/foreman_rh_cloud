module InventorySync
  module Async
    class InventoryHostsSync < QueryInventoryJob
      set_callback :iteration, :around, :setup_facet_transaction
      set_callback :step, :around, :create_facets

      def plan
        unless cloud_auth_available?
          logger.debug('Cloud authentication is not available, skipping inventory hosts sync')
          return
        end

        # by default the tasks will be executed concurrently
        plan_self
        plan_self_host_sync
      end

      def setup_facet_transaction
        InsightsFacet.transaction do
          yield
        end
      end

      def create_facets
        # get the results from the event
        results = yield
        add_missing_insights_facets(results.host_uuids)
        results
      end

      private

      def add_missing_insights_facets(uuids_hash)
        all_facets = uuids_hash.map do |host_id, uuid|
          {
            host_id: host_id,
            uuid: uuid,
          }
        end

        InsightsFacet.upsert_all(all_facets, unique_by: :host_id) unless all_facets.empty?
      end

      def plan_self_host_sync
        plan_action InventorySync::Async::InventorySelfHostSync
      end
    end
  end
end
