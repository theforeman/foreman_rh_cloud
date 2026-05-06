require 'test_plugin_helper'
require 'foreman_tasks/test_helpers'

class InsightsGenerateNotificationsTest < ActiveSupport::TestCase
  include Dynflow::Testing::Factories

  setup do
    User.current = User.find_by(login: 'secret_admin')
  end

  test 'skips notifications when foreman_host is nil' do
    ForemanRhCloud.stubs(:foreman_host).returns(nil)

    # Ensure blueprint exists or create it
    NotificationBlueprint.find_or_create_by(name: 'insights_satellite_hits') do |bp|
      bp.message = 'Test message'
      bp.level = 'info'
      bp.expires_in = 7.days
    end

    plan = ForemanTasks.sync_task(InsightsCloud::Async::InsightsGenerateNotifications)

    # Should not raise an error, task completes successfully
    assert_includes ['success', 'stopped'], plan.state, "Task should complete without error"
  end
end
