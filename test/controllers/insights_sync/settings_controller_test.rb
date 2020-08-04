require 'test_plugin_helper'

class SettingsControllerTest < ActionController::TestCase
  tests InsightsCloud::SettingsController

  test 'should return allow_auto_insights_sync setting' do
    FactoryBot.create(:setting, :name => 'allow_auto_insights_sync', :settings_type => "boolean", :category => "Setting::RhCloud", :default => false, :value => false)

    assert_equal false, Setting[:allow_auto_insights_sync]

    get :show, session: set_session_user

    assert_response :success
    actual = JSON.parse(response.body)
    assert_equal false, actual['insightsSyncEnabled']
  end

  test 'should update allow_auto_insights_sync setting' do
    FactoryBot.create(:setting, :name => 'allow_auto_insights_sync', :settings_type => "boolean", :category => "Setting::RhCloud", :default => false, :value => false)

    assert_equal false, Setting[:allow_auto_insights_sync]

    patch :update, params: { insightsSyncEnabled: true }, session: set_session_user

    assert_response :success
    actual = JSON.parse(response.body)
    assert_equal true, actual['insightsSyncEnabled']
    assert_equal true, Setting[:allow_auto_insights_sync]
  end
end
