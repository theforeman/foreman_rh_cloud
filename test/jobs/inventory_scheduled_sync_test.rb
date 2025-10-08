require 'test_plugin_helper'
require 'foreman_tasks/test_helpers'

class InventoryScheduledSyncTest < ActiveSupport::TestCase
  include Dynflow::Testing::Factories

  test 'Schedules an execution if auto upload is enabled' do
    Setting[:allow_auto_inventory_upload] = true
    Setting[:allow_auto_insights_mismatch_delete] = true

    InventorySync::Async::InventoryScheduledSync.any_instance.expects(:plan_org_sync).times(Organization.unscoped.count)
    InventorySync::Async::InventoryScheduledSync.any_instance.expects(:plan_remove_insights_hosts).times(Organization.unscoped.count)

    action = create_and_plan_action(InventorySync::Async::InventoryScheduledSync)
    run_action(action)
  end

  test 'Skips execution if with_iop_smart_proxy? is true' do
    ForemanRhCloud.stubs(:with_iop_smart_proxy?).returns(true)

    InventorySync::Async::InventoryScheduledSync.any_instance.expects(:plan_org_sync).never

    action = create_and_plan_action(InventorySync::Async::InventoryScheduledSync)
    action = run_action(action)
    status = action.output[:status].to_s
    assert_match(/Foreman is configured with a local IoP Smart Proxy/, status)
  end

  test 'Skips execution if auto upload is disabled' do
    Setting[:allow_auto_inventory_upload] = false

    InventorySync::Async::InventoryScheduledSync.any_instance.expects(:plan_org_sync).never

    action = create_and_plan_action(InventorySync::Async::InventoryScheduledSync)
    run_action(action)
  end

  test 'Skips mismatch deletion if the setting is disabled' do
    Setting[:allow_auto_inventory_upload] = true
    Setting[:allow_auto_insights_mismatch_delete] = false

    InventorySync::Async::InventoryScheduledSync.any_instance.expects(:plan_org_sync).times(Organization.unscoped.count)
    InventorySync::Async::InventoryScheduledSync.any_instance.expects(:plan_remove_insights_hosts).never

    action = create_and_plan_action(InventorySync::Async::InventoryScheduledSync)
    run_action(action)
  end
end
