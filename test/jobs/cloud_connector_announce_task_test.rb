require 'test_plugin_helper'
require 'foreman_tasks/test_helpers'

class CloudConnectorAnnounceTaskTest < ActiveSupport::TestCase
  include Dynflow::Testing::Factories

  teardown do
    ForemanRhCloud.unstub(:with_iop_smart_proxy?)
  end

  test 'announces to sources for all organizations when rhc_instance_id is set' do
    Setting[:rhc_instance_id] = 'test-rhc-id'

    InsightsCloud::Async::CloudConnectorAnnounceTask.any_instance
      .stubs(:cert_auth_available?).returns(true)

    ForemanRhCloud::CloudPresence.any_instance
      .expects(:announce_to_sources)
      .times(Organization.unscoped.count)

    action = create_and_plan_action(InsightsCloud::Async::CloudConnectorAnnounceTask)
    run_action(action)
  end

  test 'skips when rhc_instance_id is not set' do
    Setting[:rhc_instance_id] = nil

    ForemanRhCloud::CloudPresence.any_instance
      .expects(:announce_to_sources)
      .never

    action = create_and_plan_action(InsightsCloud::Async::CloudConnectorAnnounceTask)
    run_action(action)
  end

  test 'skips when rhc_instance_id is empty string' do
    Setting[:rhc_instance_id] = ''

    ForemanRhCloud::CloudPresence.any_instance
      .expects(:announce_to_sources)
      .never

    action = create_and_plan_action(InsightsCloud::Async::CloudConnectorAnnounceTask)
    run_action(action)
  end

  test 'skips when in IoP mode' do
    Setting[:rhc_instance_id] = 'test-rhc-id'
    ForemanRhCloud.stubs(:with_iop_smart_proxy?).returns(true)

    ForemanRhCloud::CloudPresence.any_instance
      .expects(:announce_to_sources)
      .never

    action = create_and_plan_action(InsightsCloud::Async::CloudConnectorAnnounceTask)
    run_action(action)
  end

  test 'skips organizations without a manifest' do
    Setting[:rhc_instance_id] = 'test-rhc-id'

    InsightsCloud::Async::CloudConnectorAnnounceTask.any_instance
      .stubs(:cert_auth_available?).returns(false)

    ForemanRhCloud::CloudPresence.any_instance
      .expects(:announce_to_sources)
      .never

    action = create_and_plan_action(InsightsCloud::Async::CloudConnectorAnnounceTask)
    run_action(action)
  end

  test 'continues processing other orgs when one fails' do
    Setting[:rhc_instance_id] = 'test-rhc-id'

    InsightsCloud::Async::CloudConnectorAnnounceTask.any_instance
      .stubs(:cert_auth_available?).returns(true)

    call_count = 0
    ForemanRhCloud::CloudPresence.any_instance.stubs(:announce_to_sources).with do
      call_count += 1
      raise StandardError, 'API error' if call_count == 1
      true
    end

    action = create_and_plan_action(InsightsCloud::Async::CloudConnectorAnnounceTask)
    run_action(action)

    assert_equal Organization.unscoped.count, call_count
  end
end
