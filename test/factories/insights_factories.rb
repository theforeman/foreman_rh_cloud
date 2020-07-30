FactoryBot.define do
  factory :insights_facet do
    # sequence(:uuid) { |n| "uuid-#{n}" }

    trait :with_hits do
      hits do
        Array.new(1) { association(:insights_hit, host_id: host_id) }
      end
    end
  end

  factory :insights_hit do
    last_seen { Date.yesterday }
    sequence(:title) { |n| "hit title #{n}" }
    sequence(:solution_url) { |n| "http://example.com/solutions/#{n}" }
    total_risk { 1 }
    likelihood { 2 }
    publish_date { Time.now }
    sequence(:results_url) { |n| "http://example.com/results/#{n}" }
  end
end

FactoryBot.modify do
  factory :host do
    trait :with_insights_hits do
      after(:create) do |host, _evaluator|
        host.insights = FactoryBot.create(:insights_facet, :with_hits, host_id: host.id)
      end
    end
  end
end
