require 'test_plugin_helper'
require 'foreman_tasks/test_helpers'

class ExponentialBackoffTest < ActiveSupport::TestCase
  include ForemanTasks::TestHelpers::WithInThreadExecutor

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

    ForemanTasks.sync_task(TestAction)
  end

  test 'fails after a single excution if done was called' do
    TestAction.any_instance.expects(:action_callback).returns(
      lambda do |instance|
        instance.done!
        raise ::Foreman::Exception('Foo')
      end)

    ForemanTasks.sync_task(TestAction)
  end

  test 'executes the task three times before failing it' do
    # speed up the execution
    TestAction.any_instance.stubs(:poll_intervals).returns([0, 0, 0])

    TestAction.any_instance.expects(:action_callback).raises(::Foreman::Exception.new('Foo')).times(3)

    ForemanTasks.sync_task(TestAction)
  rescue ForemanTasks::TaskError => ex
    assert ex.aggregated_message =~ /Foo/
  end
end
