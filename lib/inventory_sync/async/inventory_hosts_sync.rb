module InventorySync
  module Async
    class InventoryHostsSync < QueryInventoryJob
      set_callback :iteration, :around, :setup_facet_transaction
      set_callback :step, :around, :create_facets

      def plan(organizations)
        # by default the tasks will be executed concurrently
        super(organizations)
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
        add_missing_insights_facets(results.organization, results.host_uuids)
        results
      end

      def rescue_strategy_for_self
        Dynflow::Action::Rescue::Fail
      end

      private

      def add_missing_insights_facets(organization, uuids_hash)
        # Filter out hosts that belong to different organization (although they are visible by the query)
        unrelated_hosts = Host.where.not(organization_id: organization.id).where(id: uuids_hash.keys).pluck(:id)
        all_facets = uuids_hash.except(unrelated_hosts).map do |host_id, uuid|
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

      def action_name
        'inventory hosts sync'
      end
    end
  end
end
