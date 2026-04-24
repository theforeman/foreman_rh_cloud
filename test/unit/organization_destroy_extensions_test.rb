require 'test_plugin_helper'
require 'foreman_tasks/test_helpers'

class OrganizationDestroyExtensionsTest < ActiveSupport::TestCase
  include Dynflow::Testing

  setup do
    User.current = User.find_by(login: 'secret_admin')

    @organization = stub
    @organization.stubs(:label).returns('test_org')
    @organization.stubs(:id).returns(1)
    @organization.stubs(:validate_destroy).returns([])
    @organization.stubs(:products).returns([])
    @organization.stubs(:activation_keys).returns([])
    @organization.stubs(:content_views).returns(stub(:non_default => []))
    @organization.stubs(:default_content_view).returns(stub(:content_view_environments => []))
    @organization.stubs(:promotion_paths).returns([])
    @organization.stubs(:providers).returns([])
    @organization.stubs(:library).returns(stub(:destroy! => true))

    where_clause = mock
    where_clause.stubs(:where).returns([])
    ::Host.stubs(:unscoped).returns(where_clause)
  end

  teardown do
    ForemanRhCloud.unstub(:with_iop_smart_proxy?)
  end

  test 'plans DestroyOrganizationHbiHostsJob when in IoP mode' do
    ForemanRhCloud.stubs(:with_iop_smart_proxy?).returns(true)

    action = create_action(::Actions::Katello::Organization::Destroy)
    action.stubs(:action_subject).with(@organization)
    plan_action(action, @organization)

    assert_action_planned_with(action, ForemanInventoryUpload::Async::DestroyOrganizationHbiHostsJob, @organization.id)
  end

  test 'does not plan DestroyOrganizationHbiHostsJob when not in IoP mode' do
    ForemanRhCloud.stubs(:with_iop_smart_proxy?).returns(false)

    action = create_action(::Actions::Katello::Organization::Destroy)
    action.stubs(:action_subject).with(@organization)
    plan_action(action, @organization)

    refute_action_planned(action, ForemanInventoryUpload::Async::DestroyOrganizationHbiHostsJob)
  end
end
