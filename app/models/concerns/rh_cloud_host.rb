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
  end
end
