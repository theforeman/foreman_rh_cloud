module RhCloudHost
  extend ActiveSupport::Concern

  included do
    has_many(
      :inventory_upload_facts,
      -> { where(fact_name_id: ForemanInventoryUpload::Generators::Queries.fact_names.values) },
      class_name: 'FactValue',
      foreign_key: :host_id
    )

    has_many :insights_hits, through: :insights, source: :hits
    scoped_search :relation => :insights, :on => :hits_count, :only_explicit => true, :rename => :insights_recommendations_count

    has_one :insights_client_report_status_object, :class_name => '::InsightsClientReportStatus', :foreign_key => 'host_id'
    scoped_search :relation => :insights_client_report_status_object, :on => :status, :rename => :insights_client_report_status,
      :complete_value => { :reporting => ::InsightsClientReportStatus::REPORTING,
                           :no_report => ::InsightsClientReportStatus::NO_REPORT }

    has_one :inventory_sync_status_object, :class_name => '::InventorySync::InventoryStatus', :foreign_key => 'host_id'
    scoped_search :relation => :inventory_sync_status_object, :on => :status, :rename => :insights_inventory_sync_status,
      :complete_value => { :disconnect => ::InventorySync::InventoryStatus::DISCONNECT,
                           :sync => ::InventorySync::InventoryStatus::SYNC }
    scoped_search :on => :id, :rename => :insights_uuid, :only_explicit => true,
      :ext_method => :search_by_insights_uuid, :complete_value => false

    def insights_facet
      insights
    end

    # In IoP, read directly from the subscription facet to avoid stale data (see comment on ensure_iop_insights_uuid)
    def insights_uuid
      ForemanRhCloud.with_iop_smart_proxy? ? subscription_facet&.uuid : insights_facet&.uuid
    end

    # In non-IoP, insights_facet uuids are assigned by Hosted.
    # In IoP, insights_facet uuids must match Katello subscription_facet uuids.
    # If the host was previously registered to hosted Insights,
    # we need to correct its uuid.
    def ensure_iop_insights_uuid
      return unless insights_facet.present? && subscription_facet.present? && insights_facet.uuid != subscription_facet.uuid
      insights_facet.update!(uuid: subscription_facet.uuid)
    end
  end

  module ClassMethods
    def search_by_insights_uuid(_key, operator, value)
      # Determine which facet table to search based on IoP mode
      facet_table = ForemanRhCloud.with_iop_smart_proxy? ? Katello::Host::SubscriptionFacet.table_name : InsightsFacet.table_name

      # Build SQL condition
      if ['IN', 'NOT IN'].include?(operator)
        # For IN/NOT IN, value may be an array or comma-separated string
        # Convert to array and build placeholders for each value
        values = value.is_a?(Array) ? value : value.to_s.split(',').map(&:strip)
        placeholders = (['?'] * values.size).join(',')
        condition = sanitize_sql_for_conditions(
          ["#{facet_table}.uuid #{operator} (#{placeholders})", *values]
        )
      else
        # For other operators (=, !=, LIKE, etc.), use value_to_sql for proper SQL formatting
        condition = sanitize_sql_for_conditions(
          ["#{facet_table}.uuid #{operator} ?", value_to_sql(operator, value)]
        )
      end

      # Return search parameters with LEFT JOIN to include hosts without facets
      {
        joins: "LEFT JOIN #{facet_table} ON #{facet_table}.host_id = #{Host::Managed.table_name}.id",
        conditions: condition,
      }
    end
  end
end
