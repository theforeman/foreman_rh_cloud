class InsightsHit < ApplicationRecord
  has_one :host
  # since the facet is one-to-one association with a host, we can connect
  # through host_id column on both this model and facet.
  belongs_to :insights_facet, foreign_key: 'host_id', primary_key: 'host_id', counter_cache: :hits_count
end
