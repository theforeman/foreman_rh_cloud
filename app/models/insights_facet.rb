class InsightsFacet < HostFacets::Base
  has_many :hits,
    foreign_key: :host_id,
    primary_key: :host_id,
    class_name: 'InsightsHit',
    dependent: :destroy
end
