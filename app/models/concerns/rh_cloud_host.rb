module RhCloudHost
  extend ActiveSupport::Concern

  included do
    has_many(
      :inventory_upload_facts,
      -> { where(fact_name_id: ForemanInventoryUpload::Generators::Queries.fact_names.values) },
      class_name: 'FactValue',
      :foreign_key => :host_id
    )
  end
end
