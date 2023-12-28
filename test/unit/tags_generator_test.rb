require 'test_plugin_helper'

class TagsGeneratorTest < ActiveSupport::TestCase
  include KatelloLocationFix
  include CandlepinIsolation

  setup do
    User.current = User.find_by(login: 'secret_admin')

    env = FactoryBot.create(:katello_k_t_environment)
    env2 = FactoryBot.create(:katello_k_t_environment, organization: env.organization)

    @location1 = FactoryBot.create(:location)
    @location2 = FactoryBot.create(:location, parent: @location1)

    @hostgroup1 = FactoryBot.create(:hostgroup)
    @hostgroup2 = FactoryBot.create(:hostgroup, parent: @hostgroup1)

    @host = FactoryBot.create(
      :host,
      :redhat,
      :with_subscription,
      :with_content,
      organization: env.organization,
      location: @location2,
      hostgroup: @hostgroup2,
      content_view_environments: [
        FactoryBot.create(
          :katello_content_view_environment,
          content_view: FactoryBot.create(:katello_content_view, organization: env.organization),
          lifecycle_environment: env),
        FactoryBot.create(
          :katello_content_view_environment,
          content_view: FactoryBot.create(:katello_content_view, organization: env.organization),
          lifecycle_environment: env2),
      ]
    )

    @host.organization.pools << FactoryBot.create(:katello_pool, account_number: '1234', cp_id: 1)
    @host.interfaces.first.identifier = 'test_nic1'
    # Don't try to update CP in tests
    Katello::Resources::Candlepin::Consumer.stubs(:update)
    # Don't try update facts for the host
    Katello::Host::SubscriptionFacet.stubs(:update_facts)
    @host.save!
  end

  test 'generates tags for a single host' do
    instance_id = Foreman.uuid
    Foreman.stubs(:instance_id).returns(instance_id)

    generator = create_generator

    actual = generator.generate.group_by { |key, value| key }

    locations = actual['location']
    assert_equal 3, locations.length

    hostgroups = actual['hostgroup']
    assert_equal 3, hostgroups.length

    assert_nil actual['host collection']

    assert_equal @host.organization.name, actual['organization'].first.last
    assert_equal @host.lifecycle_environments.pluck(:name).min, actual['lifecycle_environment'].map(&:second).min
    assert_equal @host.lifecycle_environments.pluck(:name).max, actual['lifecycle_environment'].map(&:second).max
    assert_equal @host.content_views.pluck(:name).min, actual['content_view'].map(&:second).min
    assert_equal @host.content_views.pluck(:name).max, actual['content_view'].map(&:second).max
    assert_equal Foreman.instance_id, actual['satellite_instance_id'].first.last
    assert_equal @host.organization_id.to_s, actual['organization_id'].first.last
  end

  test 'filters tags with empty values' do
    generator = create_generator

    @host.stubs(:content_views).returns([])

    actual = generator.generate.group_by { |key, value| key }

    assert_equal false, actual.key?('content_view')
  end

  test 'generates parameter tags' do
    Setting[:include_parameter_tags] = true

    @host.stubs(:host_params).returns(
      {
        'bool_param' => true,
        'false_param' => false,
        'int_param' => 1,
        'empty_param' => nil,
        'empty_str_param' => '',
      }
    )

    generator = create_generator
    actual = Hash[generator.generate_parameters]

    assert_equal 3, actual.count
    assert_equal true, actual['bool_param']
    assert_equal false, actual['false_param']
    assert_equal 1, actual['int_param']
  end

  test 'skips parameter tags if include_parameter_tags setting is off' do
    Setting[:include_parameter_tags] = false

    @host.stubs(:host_params).returns(
      {
        'bool_param' => true,
        'false_param' => false,
        'int_param' => 1,
        'empty_param' => nil,
        'empty_str_param' => '',
      }
    )

    generator = create_generator
    actual = generator.generate_parameters.group_by { |key, value| key }

    assert_equal 0, actual.count
  end

  test 'truncates parameter tags' do
    Setting[:include_parameter_tags] = true

    @host.stubs(:host_params).returns(
      {
        'str_param' => 'a' * 251,
      }
    )

    generator = create_generator
    actual = Hash[generator.generate_parameters]

    assert_equal 'Original value exceeds 250 characters', actual['str_param']
  end

  private

  def create_generator
    ForemanInventoryUpload::Generators::Tags.new(@host)
  end
end
