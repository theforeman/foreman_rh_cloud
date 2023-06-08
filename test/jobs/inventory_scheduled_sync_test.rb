require 'test_plugin_helper'
require 'foreman_tasks/test_helpers'

class InventoryScheduledSyncTest < ActiveSupport::TestCase
  include ForemanTasks::TestHelpers::WithInThreadExecutor

  test 'Schedules an execution if auto upload is enabled' do
    Setting[:allow_auto_inventory_upload] = true
    Setting[:allow_auto_insights_mismatch_delete] = true

    InventorySync::Async::InventoryScheduledSync.any_instance.expects(:plan_org_sync).times(Organization.unscoped.count)
    InventorySync::Async::InventoryScheduledSync.any_instance.expects(:plan_remove_insights_hosts).times(Organization.unscoped.count)

    ForemanTasks.sync_task(InventorySync::Async::InventoryScheduledSync)
  end

  test 'Skips execution if auto upload is disabled' do
    Setting[:allow_auto_inventory_upload] = false

    InventorySync::Async::InventoryScheduledSync.any_instance.expects(:plan_org_sync).never

    ForemanTasks.sync_task(InventorySync::Async::InventoryScheduledSync)
  end

  test 'Skips mismatch deletion if the setting is disabled' do
    Setting[:allow_auto_inventory_upload] = true
    Setting[:allow_auto_insights_mismatch_delete] = false

    InventorySync::Async::InventoryScheduledSync.any_instance.expects(:plan_org_sync).times(Organization.unscoped.count)
    InventorySync::Async::InventoryScheduledSync.any_instance.expects(:plan_remove_insights_hosts).never

    ForemanTasks.sync_task(InventorySync::Async::InventoryScheduledSync)
  end
end
