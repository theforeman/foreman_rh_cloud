attributes :uuid

node :insights_hit_details do |facet|
  facet&.host&.facts('insights::hit_details')&.values&.first
end
node :insights_hits_count do |facet|
  facet.hits&.count
end
node :use_local_advisor_engine do |_facet|
  ForemanRhCloud.with_local_advisor_engine?
end
