require 'test_plugin_helper'
require 'foreman_tasks/test_helpers'

class InventoryScheduledSyncTest < ActiveSupport::TestCase
  include ForemanTasks::TestHelpers::WithInThreadExecutor

  test 'Schedules an execution if auto upload is enabled' do
    FactoryBot.create(:setting, :name => 'allow_auto_inventory_upload', :settings_type => "boolean", :category => "Setting::RhCloud", :default => false, :value => true)

    InventorySync::Async::InventoryScheduledSync.any_instance.expects(:plan_org_sync).times(Organization.unscoped.count)

    ForemanTasks.sync_task(InventorySync::Async::InventoryScheduledSync)
  end

  test 'Skips execution if auto upload is disabled' do
    FactoryBot.create(:setting, :name => 'allow_auto_inventory_upload', :settings_type => "boolean", :category => "Setting::RhCloud", :default => false, :value => false)

    InventorySync::Async::InventoryScheduledSync.any_instance.expects(:plan_org_sync).never

    ForemanTasks.sync_task(InventorySync::Async::InventoryScheduledSync)
  end
end
