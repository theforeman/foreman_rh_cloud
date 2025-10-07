require 'test_plugin_helper'
require 'foreman_tasks/test_helpers'

class CreateMissingInsightsFacetsTest < ActiveSupport::TestCase
  include ForemanTasks::TestHelpers::WithInThreadExecutor
  include KatelloCVEHelper

  setup do
    User.current = User.find_by(login: 'secret_admin')
    @cve = make_cve
    @env = @cve.lifecycle_environment
    @organization = @env.organization

    # Create a host with subscription facet but no insights facet
    @host_without_facet = FactoryBot.create(
      :host,
      :with_subscription,
      :with_content,
      content_view: @cve.content_view,
      lifecycle_environment: @env,
      organization: @organization
    )

    # Create a host with both subscription and insights facets
    @host_with_facet = FactoryBot.create(
      :host,
      :with_subscription,
      :with_content,
      content_view: @cve.content_view,
      lifecycle_environment: @env,
      organization: @organization
    )
    @host_with_facet.build_insights(uuid: @host_with_facet.subscription_facet.uuid)
    @host_with_facet.insights.save!
  end

  test 'creates insights facets for hosts without them' do
    assert_nil @host_without_facet.insights

    task = ForemanTasks.sync_task(
      ForemanInventoryUpload::Async::CreateMissingInsightsFacets,
      @organization.id
    )

    assert_equal 'success', task.result
    @host_without_facet.reload
    assert_not_nil @host_without_facet.insights
    assert_equal @host_without_facet.subscription_facet.uuid, @host_without_facet.insights.uuid
    assert_match(/Missing Insights facets created: 1/, task.output[:result])
  end

  test 'does not create duplicate facets for hosts that already have them' do
    original_uuid = @host_with_facet.insights.uuid
    original_id = @host_with_facet.insights.id

    task = ForemanTasks.sync_task(
      ForemanInventoryUpload::Async::CreateMissingInsightsFacets,
      @organization.id
    )

    assert_equal 'success', task.result
    @host_with_facet.reload
    assert_equal original_id, @host_with_facet.insights.id
    assert_equal original_uuid, @host_with_facet.insights.uuid
  end

  test 'handles organization with no missing facets' do
    # Create insights facet for the host that was missing one
    @host_without_facet.build_insights(uuid: @host_without_facet.subscription_facet.uuid)
    @host_without_facet.insights.save!

    task = ForemanTasks.sync_task(
      ForemanInventoryUpload::Async::CreateMissingInsightsFacets,
      @organization.id
    )

    assert_equal 'success', task.result
    assert_match(/There were no missing Insights facets/, task.output[:result])
  end

  test 'creates multiple facets when multiple hosts are missing them' do
    # Remove the insights facet from the host that has one
    @host_with_facet.insights.destroy
    @host_with_facet.reload

    assert_nil @host_without_facet.insights
    assert_nil @host_with_facet.insights

    task = ForemanTasks.sync_task(
      ForemanInventoryUpload::Async::CreateMissingInsightsFacets,
      @organization.id
    )

    assert_equal 'success', task.result
    @host_without_facet.reload
    @host_with_facet.reload
    assert_not_nil @host_without_facet.insights
    assert_not_nil @host_with_facet.insights
    # After the bug fix, the count should correctly show 2 hosts
    assert_match(/Missing Insights facets created: 2/, task.output[:result])
  end

  test 'logs result message' do
    Rails.logger.expects(:info).with(regexp_matches(/Missing Insights facets created/))

    ForemanTasks.sync_task(
      ForemanInventoryUpload::Async::CreateMissingInsightsFacets,
      @organization.id
    )
  end
end
