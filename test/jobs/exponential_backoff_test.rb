require 'test_plugin_helper'
require 'foreman_tasks/test_helpers'

class ExponentialBackoffTest < ActiveSupport::TestCase
  include Dynflow::Testing::Factories

  class TestAction < ::Actions::EntryAction
    include ::ForemanRhCloud::Async::ExponentialBackoff

    def try_execute
      action_callback&.call(self)
    end

    # define a method to execute code inside the class context.
    def action_callback(instance)
    end
  end

  test 'executes an action once' do
    TestAction.any_instance.expects(:action_callback).returns(->(instance) { instance.done! })

    action = create_and_plan_action(TestAction)
    run_action(action)
  end

  test 'fails after a single excution if done was called' do
    TestAction.any_instance.expects(:action_callback).returns(
      lambda do |instance|
        instance.done!
        raise StandardError.new('Foo')
      end
    )

    action = create_and_plan_action(TestAction)
    run_action(action)
  end

  test 'executes the task three times before failing it' do
    # speed up the execution
    TestAction.any_instance.stubs(:poll_intervals).returns([0, 0, 0])

    TestAction.any_instance.expects(:action_callback).raises(StandardError.new('Foo')).at_least_once

    action = create_and_plan_action(TestAction)
    run_action(action)
  end
end
