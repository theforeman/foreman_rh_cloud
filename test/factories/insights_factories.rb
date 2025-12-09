FactoryBot.define do
  factory :insights_facet do
    sequence(:uuid) { |n| "uuid-#{n}" }

    trait :with_hits do
      hits do
        Array.new(1) { association(:insights_hit, host_id: host_id) }
      end
    end
  end

  factory :insights_hit do
    last_seen { DateTime.yesterday }
    sequence(:title) { |n| "hit title #{n}" }
    sequence(:solution_url) { |n| "http://example.com/solutions/#{n}" }
    total_risk { 1 }
    likelihood { 2 }
    publish_date { DateTime.now }
    sequence(:results_url) { |n| "https://cloud.redhat.com/insights/overview/stability/test_rule%7CTEST_RULE/accdf444-5628-451d-bf3e-cf909ad7275#{n}/" }
    rule_id { "test_rule|TEST_RULE" }
  end

  factory :insights_rule do
    sequence(:rule_id) { |n| "test_rule#{n}|TEST_RULE#{n}" }
    description { 'test rule description' }
    category_name { 'Testing' }
    impact_name { 'Testing error' }
    summary { 'Testing summary' }
    generic { 'Testing generic' }
    reason { 'No apparent reason' }
    total_risk { -1 }
    reboot_required { true }
    more_info { 'more test info' }
    rating { 0 }
  end

  factory :insights_resolution do
    sequence(:rule_id) { |n| "test_rule#{n}|TEST_RULE#{n}" }
    description { 'fix the issue on the fly' }
    needs_reboot { false }
    resolution_risk { 1 }
    resolution_type { 'fix' }
  end

  factory :insights_missing_host do
    organization { association :organization }
    sequence(:name) { |n| "removed.host#{n}.test" }
    insights_id { Foreman.uuid }
    rhsm_id { Foreman.uuid }
    ip_address { "192.168.1.1,192.168.2.1" }
  end
end

FactoryBot.modify do
  factory :host do
    trait :with_insights_hits do
      after(:create) do |host, _evaluator|
        host.insights = FactoryBot.create(:insights_facet, :with_hits, host_id: host.id)
      end
    end

    trait :with_mismatched_insights_uuid do
      # Simulates host previously registered to cloud with stale UUID
      # Requires :with_subscription trait to be used together
      after(:create) do |host, _evaluator|
        host.insights = FactoryBot.create(
          :insights_facet,
          host_id: host.id,
          uuid: 'stale-cloud-uuid' # Different from subscription_facet
        )
      end
    end

    trait :with_synced_insights_uuid do
      # Ideal state: insights_facet UUID matches subscription_facet UUID
      # Requires :with_subscription trait to be used together
      after(:create) do |host, _evaluator|
        subscription_uuid = host.subscription_facet&.uuid
        host.insights = FactoryBot.create(
          :insights_facet,
          host_id: host.id,
          uuid: subscription_uuid  # Same as subscription_facet
        )
      end
    end
  end
end
