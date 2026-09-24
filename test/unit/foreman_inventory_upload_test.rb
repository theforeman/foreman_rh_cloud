require 'test_plugin_helper'

class ForemanInventoryUploadTest < ActiveSupport::TestCase
  setup do
    if ForemanInventoryUpload.instance_variable_defined?(:@base_folder)
      ForemanInventoryUpload.remove_instance_variable(:@base_folder)
    end
  end

  test 'uses shared tmpdir when writable' do
    File.expects(:writable?).with(ForemanInventoryUpload::SHARED_TMPDIR).returns(true)

    assert_equal '/var/run/foreman/red_hat_inventory/', ForemanInventoryUpload.base_folder
  end

  test 'falls back to rails tmp when shared tmpdir is not writable' do
    File.expects(:writable?).with(ForemanInventoryUpload::SHARED_TMPDIR).returns(false)

    assert_equal "#{Rails.root.join('tmp', 'red_hat_inventory')}/", ForemanInventoryUpload.base_folder
  end
end
