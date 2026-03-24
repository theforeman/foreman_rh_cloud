module ForemanInventoryUpload
  module Async
    class CreateMissingInsightsFacets < ::Actions::EntryAction
      def plan(organization_id)
        plan_self(organization_id: organization_id)
      end

      def run
        organization = ::Organization.find(input[:organization_id])
        # Find hosts with subscription facets but without insights facets
        # Note: We can't use scoped_search 'null? insights_uuid' because the null? operator
        # doesn't work with ext_methods - it would check hosts.id IS NULL instead of the facet
        hosts_without_facets = ::ForemanInventoryUpload::Generators::Queries.for_org(organization, use_batches: false)
                                                                            .left_outer_joins(:insights)
                                                                            .where(insights_facets: { id: nil })

        facet_count = 0
        hosts_without_facets.in_batches(of: ForemanInventoryUpload.slice_size) do |batch|
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
        Rails.logger.debug output[:result]
      end
    end
  end
end
