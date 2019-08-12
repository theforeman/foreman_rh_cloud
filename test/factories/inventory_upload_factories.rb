# redefine katello factories, as long as katello is not compatible with dynamic properties
FactoryBot.define do
  factory :katello_organization, :class => "Organization" do
    type {"Organization"}
    sequence(:name) { |n| "Organization#{n}" }
    sequence(:label) { |n| "org#{n}" }
    sequence(:id) { |n| n }

    trait :acme_corporation do
      name {"ACME_Corporation"}
      type {"Organization"}
      description {"This is the first Organization."}
      label {"acme_corporation_label"}
    end

    trait :with_library do
      association :library, :factory => :katello_library
    end

    factory :acme_corporation, :traits => [:acme_corporation]
  end
end

FactoryBot.define do
  factory :katello_content_view, :class => Katello::ContentView do
    sequence(:name) { |n| "Database#{n}" }
    description {"This content view is for database content"}
    association :organization, :factory => :katello_organization

    trait :composite do
      composite {true}
    end
  end
end

FactoryBot.define do
  factory :katello_k_t_environment, :aliases => [:katello_environment], :class => Katello::KTEnvironment do
    sequence(:name) { |n| "Environment#{n}" }
    sequence(:label) { |n| "environment#{n}" }
    association :organization, :factory => :katello_organization
  end
end

FactoryBot.define do
  factory :katello_content_facets, :aliases => [:content_facet], :class => ::Katello::Host::ContentFacet do
    sequence(:uuid) { |n| "uuid-#{n}" }
  end
end

FactoryBot.define do
  factory :katello_subscription_facets, :aliases => [:subscription_facet], :class => ::Katello::Host::SubscriptionFacet do
    sequence(:uuid) { |n| "uuid-#{n}-#{rand(500)}" }
    facts { {'memory.memtotal' => "12 GB"} }
  end
end

FactoryBot.define do
  factory :katello_pool, :class => Katello::Pool do
    active {true}
    end_date {Date.today + 1.year}
  end
end

FactoryBot.modify do
  factory :host do
    transient do
      content_view {nil}
      lifecycle_environment {nil}
      content_source {nil}
    end

    trait :with_content do
      association :content_facet, :factory => :content_facet, :strategy => :build

      after(:build) do |host, evaluator|
        if host.content_facet
          host.content_facet.content_view = evaluator.content_view if evaluator.content_view
          host.content_facet.lifecycle_environment = evaluator.lifecycle_environment if evaluator.lifecycle_environment
          host.content_facet.content_source = evaluator.content_source if evaluator.content_source
        end
      end
    end

    trait :with_subscription do
      association :subscription_facet, :factory => :subscription_facet, :strategy => :build
    end
  end
end
