FactoryBot.define do
  factory :katello_host_collection_host, :class => Katello::HostCollectionHosts do
    host_id { nil }
    host_collection_id { nil }
  end

  factory :katello_host_collection, :class => Katello::HostCollection do
    sequence(:name) { |n| "Host Collection #{n}" }
    organization_id { nil }
  end
end

# Fix Katello factories to return a valid UUID
FactoryBot.modify do
  factory :katello_subscription_facets, :aliases => [:subscription_facet], :class => ::Katello::Host::SubscriptionFacet do
    sequence(:uuid) { |n| "00000000-%<n>04d-%<r>04d-0000-000000000000" % { n: n, r: rand(500) } }
    facts { { 'memory.memtotal' => "12 GB" } }
  end
end
