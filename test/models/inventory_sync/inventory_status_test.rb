require 'test_plugin_helper'

module InventorySync
  class InventoryStatusTest < ActiveSupport::TestCase
    setup do
      @host = FactoryBot.create(:host, :managed)
    end

    test 'status constants are defined correctly' do
      assert_equal 0, InventorySync::InventoryStatus::DISCONNECT
      assert_equal 1, InventorySync::InventoryStatus::SYNC
      assert_equal 2, InventorySync::InventoryStatus::USER_OMITTED
    end

    test 'to_global returns OK for USER_OMITTED status' do
      status = @host.get_status(InventorySync::InventoryStatus)
      status.status = InventorySync::InventoryStatus::USER_OMITTED
      status.save!

      assert_equal HostStatus::Global::OK, status.to_global
    end

    test 'to_global returns WARN for DISCONNECT status' do
      status = @host.get_status(InventorySync::InventoryStatus)
      status.status = InventorySync::InventoryStatus::DISCONNECT
      status.save!

      assert_equal HostStatus::Global::WARN, status.to_global
    end

    test 'to_global returns OK for SYNC status' do
      status = @host.get_status(InventorySync::InventoryStatus)
      status.status = InventorySync::InventoryStatus::SYNC
      status.save!

      assert_equal HostStatus::Global::OK, status.to_global
    end

    test 'to_label returns appropriate messages for each status' do
      status = @host.get_status(InventorySync::InventoryStatus)

      # Test DISCONNECT label
      status.status = InventorySync::InventoryStatus::DISCONNECT
      status.save!
      label = status.to_label
      assert_match(/not present/, label.downcase)
      assert_match(/console\.redhat\.com/, label)

      # Test SYNC label
      status.status = InventorySync::InventoryStatus::SYNC
      status.save!
      label = status.to_label
      assert_match(/uploaded.*present/, label.downcase)
      assert_match(/console\.redhat\.com/, label)

      # Test USER_OMITTED label
      status.status = InventorySync::InventoryStatus::USER_OMITTED
      status.save!
      label = status.to_label
      assert_match(/excluded/, label.downcase)
      assert_match(/host parameter/, label.downcase)
      assert_match(/console\.redhat\.com/, label)
    end

    test 'relevant? returns true in regular (non-IoP) mode' do
      ForemanRhCloud.stubs(:with_iop_smart_proxy?).returns(false)

      status = @host.get_status(InventorySync::InventoryStatus)
      status.status = InventorySync::InventoryStatus::SYNC
      status.save!

      assert status.relevant?, 'Inventory status should be relevant in regular mode'
    end

    test 'relevant? returns false in IoP mode' do
      ForemanRhCloud.stubs(:with_iop_smart_proxy?).returns(true)

      status = @host.get_status(InventorySync::InventoryStatus)
      status.status = InventorySync::InventoryStatus::SYNC
      status.save!

      refute status.relevant?, 'Inventory status should NOT be relevant in IoP mode'
    end
  end
end
