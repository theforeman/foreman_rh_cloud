module ForemanInventoryUpload
  module Async
    class CreateMissingInsightsFacets < ::Actions::EntryAction
      def plan(organization_id)
        plan_self(organization_id: organization_id)
      end

      def run
        organization = ::Organization.find(input[:organization_id])
        hosts_without_facets = ::ForemanInventoryUpload::Generators::Queries.for_org(organization, hosts_query: 'null? insights_uuid')
        facet_count = 0
        hosts_without_facets.each do |batch|
          facets = batch.pluck(:id, 'katello_subscription_facets.uuid').map do |host_id, uuid|
            {
              host_id: host_id,
              uuid: uuid,
            }
          end
          # We don't need to validate the facets here as we create the necessary fields.
          # rubocop:disable Rails/SkipsModelValidations
          InsightsFacet.upsert_all(facets, unique_by: :host_id) unless facets.empty?
          # rubocop:enable Rails/SkipsModelValidations
          facet_count += facets.size
        end
        output[:result] = facet_count.zero? ? _("There were no missing Insights facets") : format(_("Missing Insights facets created: %s"), facet_count)
        Rails.logger.info output[:result]
      end
    end
  end
end
