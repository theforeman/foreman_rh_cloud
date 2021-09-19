require 'test_plugin_helper'
require 'foreman_tasks/test_helpers'

class ShellProcessJobTest < ActiveSupport::TestCase
  class TestProcessJob < ForemanInventoryUpload::Async::ShellProcess
    def command
      'echo testing env: $testenv'
    end

    def env
      super.merge(
        'testenv' => 'test_val'
      )
    end
  end

  include ForemanTasks::TestHelpers::WithInThreadExecutor
  include FolderIsolation

  test 'Runs a process with environment vars' do
    label = Foreman.uuid
    ForemanTasks.sync_task(TestProcessJob, label)

    progress_output = ForemanInventoryUpload::Async::ProgressOutput.get(label)

    assert_match(/test_val/, progress_output.full_output)
    assert_match(/exit 0/, progress_output.status)
  end
end
