require 'test_plugin_helper'
require 'foreman_tasks/test_helpers'

class CreateMissingInsightsFacetsTest < ActiveSupport::TestCase
  include Dynflow::Testing::Factories
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

    action = create_and_plan_action(
      ForemanInventoryUpload::Async::CreateMissingInsightsFacets,
      @organization.id
    )
    action = run_action(action)

    @host_without_facet.reload
    assert_not_nil @host_without_facet.insights
    assert_equal @host_without_facet.subscription_facet.uuid, @host_without_facet.insights.uuid
    assert_match(/Missing Insights facets created: 1/, action.output[:result])
  end

  test 'does not create duplicate facets for hosts that already have them' do
    original_uuid = @host_with_facet.insights.uuid
    original_id = @host_with_facet.insights.id

    action = create_and_plan_action(
      ForemanInventoryUpload::Async::CreateMissingInsightsFacets,
      @organization.id
    )
    run_action(action)

    @host_with_facet.reload
    assert_equal original_id, @host_with_facet.insights.id
    assert_equal original_uuid, @host_with_facet.insights.uuid
  end

  test 'handles organization with no missing facets' do
    # Create insights facet for the host that was missing one
    @host_without_facet.build_insights(uuid: @host_without_facet.subscription_facet.uuid)
    @host_without_facet.insights.save!

    action = create_and_plan_action(
      ForemanInventoryUpload::Async::CreateMissingInsightsFacets,
      @organization.id
    )
    action = run_action(action)

    assert_match(/There were no missing Insights facets/, action.output[:result])
  end

  test 'creates multiple facets when multiple hosts are missing them' do
    # Remove the insights facet from the host that has one
    @host_with_facet.insights.destroy
    @host_with_facet.reload

    assert_nil @host_without_facet.insights
    assert_nil @host_with_facet.insights

    action = create_and_plan_action(
      ForemanInventoryUpload::Async::CreateMissingInsightsFacets,
      @organization.id
    )
    action = run_action(action)

    @host_without_facet.reload
    @host_with_facet.reload
    assert_not_nil @host_without_facet.insights
    assert_not_nil @host_with_facet.insights
    # After the bug fix, the count should correctly show 2 hosts
    assert_match(/Missing Insights facets created: 2/, action.output[:result])
  end

  test 'logs result message' do
    Rails.logger.expects(:info).with(regexp_matches(/Missing Insights facets created/))

    action = create_and_plan_action(
      ForemanInventoryUpload::Async::CreateMissingInsightsFacets,
      @organization.id
    )
    run_action(action)
  end

  test 'correctly counts facets across multiple batches' do
    # Remove existing insights facet
    @host_with_facet.insights.destroy
    @host_with_facet.reload

    # Stub the batch size to force multiple batches with just 2 hosts
    ForemanInventoryUpload.stubs(:slice_size).returns(1)

    assert_nil @host_without_facet.insights
    assert_nil @host_with_facet.insights

    action = create_and_plan_action(
      ForemanInventoryUpload::Async::CreateMissingInsightsFacets,
      @organization.id
    )
    action = run_action(action)

    @host_without_facet.reload
    @host_with_facet.reload
    assert_not_nil @host_without_facet.insights
    assert_not_nil @host_with_facet.insights
    # Count should be 2 even though processed in 2 separate batches
    assert_match(/Missing Insights facets created: 2/, action.output[:result])
  end

  test 'handles error when InsightsFacet.upsert_all fails' do
    # Stub upsert_all to raise an exception
    InsightsFacet.stubs(:upsert_all).raises(StandardError.new('upsert failed'))

    action = create_and_plan_action(
      ForemanInventoryUpload::Async::CreateMissingInsightsFacets,
      @organization.id
    )

    assert_raises(StandardError) do
      run_action(action)
    end
  end
end
