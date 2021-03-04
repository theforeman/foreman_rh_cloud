require 'test_plugin_helper'

class UploadsSettingsControllerTest < ActionController::TestCase
  tests ForemanInventoryUpload::UploadsSettingsController

  test 'should get upload inventory settings' do
    FactoryBot.create(:setting, :name => 'allow_auto_inventory_upload', :settings_type => "boolean", :category => "Setting::RhCloud", :default => false, :value => true)

    assert_equal true, Setting[:allow_auto_inventory_upload]

    get :index, session: set_session_user

    assert_response :success
    actual = JSON.parse(response.body)
    assert_equal true, actual['autoUploadEnabled']
    assert_equal true, Setting[:allow_auto_inventory_upload]
  end

  test 'should update allow_auto_inventory_upload setting' do
    FactoryBot.create(:setting, :name => 'allow_auto_inventory_upload', :settings_type => "boolean", :category => "Setting::RhCloud", :default => false, :value => false)

    assert_equal false, Setting[:allow_auto_inventory_upload]

    post :set_advanced_setting, params: { setting: :allow_auto_inventory_upload, value: true }, session: set_session_user

    assert_response :success
    actual = JSON.parse(response.body)
    assert_equal true, actual['autoUploadEnabled']
    assert_equal true, Setting[:allow_auto_inventory_upload]
  end
end
