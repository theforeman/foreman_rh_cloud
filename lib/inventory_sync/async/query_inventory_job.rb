require 'rest-client'

module InventorySync
  module Async
    class QueryInventoryJob < ::Actions::EntryAction
      include ActiveSupport::Callbacks
      include ::ForemanRhCloud::CertAuth

      define_callbacks :iteration, :step

      def plan(organizations, **params)
        actual_params = params.merge(
          {
            organization_ids: Array(organizations).map(&:id),
          }
        )

        plan_self(actual_params)
      end

      def run
        run_callbacks :iteration do
          organizations.each do |organization|
            if !cert_auth_available?(organization) || organization.manifest_expired?
              logger.debug("Subscription manifest not available, skipping #{action_name} for organization #{organization.name}")
              next
            end

            logger.debug("Executing #{action_name} for organization #{organization.name}")

            page = 1
            loop do
              api_response = query_inventory(organization, page)
              results = HostResult.new(api_response, organization)
              logger.debug("Downloaded cloud inventory data: #{results.percentage}%")

              run_callbacks :step do
                results
              end

              page += 1
              break if results.last?
            end
          end
        end
      end

      private

      def query_inventory(organization, page = 1)
        hosts_inventory_response = execute_cloud_request(
          organization: organization,
          method: :get,
          url: request_url,
          headers: {
            params: {
              per_page: 100,
              page: page,
            },
          }
        )

        JSON.parse(hosts_inventory_response)
      end

      def logger
        action_logger
      end

      def request_url
        ForemanInventoryUpload.inventory_export_url
      end

      def rescue_strategy_for_self
        Dynflow::Action::Rescue::Fail
      end

      def organizations
        @organizations ||= Organization.where(id: input[:organization_ids])
      end

      def action_name
        'inventory query'
      end
    end
  end
end
