collection @hosts

attributes :name
node :insights_uuid, &:insights_uuid
node :insights_hit_details do |host|
  host&.facts('insights::hit_details')&.values&.first
end
