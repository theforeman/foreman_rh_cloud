class InsightsHit < ApplicationRecord
  belongs_to :host
  # since the facet is one-to-one association with a host, we can connect
  # through host_id column on both this model and facet.
  belongs_to :insights_facet, foreign_key: 'host_id', primary_key: 'host_id', counter_cache: :hits_count
  scoped_search on: :title, complete_value: true
  scoped_search on: :total_risk, complete_value: :true
  scoped_search relation: :host, on: :name, rename: :hostname, complete_value: true
end
