attributes :uuid

node :insights_hit_details do |facet|
  facet&.host&.facts('insights::hit_details')&.values&.first
end
node :insights_hits_count do |facet|
  facet.hits&.count
end
node :use_iop_mode do |_facet|
  ForemanRhCloud.with_iop_smart_proxy?
end
