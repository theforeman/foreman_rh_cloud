module InventorySync
  module Async
    class InventoryHostsSync < QueryInventoryJob
      MAX_IP_STRING_SIZE = 254

      set_callback :iteration, :around, :setup_facet_transaction
      set_callback :step, :around, :create_facets
      set_callback :step, :around, :create_missing_hosts

      def plan(organizations)
        # by default the tasks will be executed concurrently
        super(organizations)
        plan_self_host_sync
      end

      def setup_facet_transaction
        ActiveRecord::Base.transaction do
          yield
        end
      end

      def create_facets
        # get the results from the event
        results = yield
        add_missing_insights_facets(results.organization, results.host_uuids)
        results
      end

      def create_missing_hosts
        results = yield
        missing_hosts = results.missing_hosts.map { |host| to_missing_host_record(host, results.organization) }
        # remove records that are no longer in the query results
        InsightsMissingHost.
          where.not(insights_id: missing_hosts.map { |host_hash| host_hash[:insights_id] }).
          where(organization_id: results.organization.id).delete_all
        # readd new hosts that appear in the results, but the subscription_id is missing from the DB.
        InsightsMissingHost.upsert_all(missing_hosts) if missing_hosts.present?
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

      def to_missing_host_record(host_result, organization)
        {
          name: host_result['fqdn'],
          insights_id: host_result['id'],
          rhsm_id: host_result['subscription_manager_id'],
          ip_address: to_ip_address_string(host_result['ip_addresses']),
          organization_id: organization.id,
        }
      end

      def to_ip_address_string(ip_addresses)
        string_size = 0
        ip_addresses&.take_while { |address| (string_size += address.length) <= MAX_IP_STRING_SIZE }
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
