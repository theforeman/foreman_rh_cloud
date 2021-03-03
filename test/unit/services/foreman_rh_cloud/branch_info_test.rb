require 'test_plugin_helper'

class BranchInfoTest < ActiveSupport::TestCase
  setup do
    User.current = User.find_by(login: 'secret_admin')

    @env = FactoryBot.create(:katello_k_t_environment)
    cv = @env.content_views << FactoryBot.create(:katello_content_view, organization: @env.organization)

    @host = FactoryBot.create(
      :host,
      :with_subscription,
      :with_content,
      :with_hostgroup,
      :with_parameter,
      content_view: cv.first,
      lifecycle_environment: @env,
      organization: @env.organization
    )

    @host.subscription_facet.pools << FactoryBot.create(:katello_pool, account_number: '5678', cp_id: 1)
  end

  test 'should generate branch info for host' do
    uuid = 'abcd-1234-qwerty'
    branch_id = 'efgh-ijkl-mnop'
    hostname = 'test.host.example.com'
    info = ::ForemanRhCloud::BranchInfo.new.generate(uuid, @host, branch_id, hostname)

    assert_equal uuid, info[:remote_leaf]
    assert_equal branch_id, info[:remote_branch]
    assert_equal @host.organization.title, info[:display_name]
    assert_equal hostname, info[:hostname]
    assert_equal @host.organization.id, info[:organization_id]
    assert_equal Foreman.instance_id, info[:satellite_instance_id]
  end

  test 'should generate appropriate labels' do
    2.times { FactoryBot.create(:katello_host_collection, :organization_id => @host.organization.id) }

    FactoryBot.create(:setting, :settings_type => 'boolean', :default => true, :name => :include_parameter_tags)

    Katello::HostCollection.all.map do |collection|
      FactoryBot.create(:katello_host_collection_host, :host_id => @host.id, :host_collection_id => collection.id)
    end

    labels = ::ForemanRhCloud::BranchInfo.new.generate('a1', @host, 'branch', 'foo')[:labels]

    org_label = labels.find { |label| label[:key] == 'organization' }
    loc_label = labels.find { |label| label[:key] == 'location' }
    assert_equal @host.organization.title, org_label[:value]
    assert_equal @host.location.title, loc_label[:value]

    hg_label = labels.find { |label| label[:key] == 'hostgroup' }
    host_colections = labels.select { |label| label[:key] == 'host collection' }
    assert_equal @host.hostgroup.name, hg_label[:value]
    assert_equal 2, host_colections.count
    refute_empty labels.select { |label| label[:namespace] == 'satellite_parameter' }
  end
end
