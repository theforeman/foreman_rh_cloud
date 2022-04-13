require 'test_plugin_helper'

class PlaybookProgressGeneratorTest < ActiveSupport::TestCase
  setup do
    @correlation_id = 'CORRELATION_ID'
    @generator = InsightsCloud::Generators::PlaybookProgressGenerator.new(@correlation_id)
  end

  test 'Outputs host progress message' do
    @generator.host_progress_message('test_host', 'test_output', 0)

    actual = @generator.generate
    actual_message = JSON.parse(actual)

    assert_equal "playbook_run_update", actual_message["type"]
    assert_equal 3, actual_message["version"]
    assert_equal @correlation_id, actual_message["correlation_id"]
    assert_equal 0, actual_message["sequence"]
    assert_equal 'test_host', actual_message["host"]
    assert_equal 'test_output', actual_message["console"]
  end

  test 'Outputs host finished with error message' do
    @generator.host_finished_message('test_host', 100)

    actual = @generator.generate
    actual_message = JSON.parse(actual)

    assert_equal "playbook_run_finished", actual_message["type"]
    assert_equal 3, actual_message["version"]
    assert_equal @correlation_id, actual_message["correlation_id"]
    assert_equal 'test_host', actual_message["host"]
    assert_equal 'failure', actual_message["status"]
    assert_equal 0, actual_message["connection_code"]
    assert_equal 100, actual_message["execution_code"]
  end

  test 'Outputs host finished successfully message' do
    @generator.host_finished_message('test_host', 0)

    actual = @generator.generate
    actual_message = JSON.parse(actual)

    assert_equal "playbook_run_finished", actual_message["type"]
    assert_equal 3, actual_message["version"]
    assert_equal @correlation_id, actual_message["correlation_id"]
    assert_equal 'test_host', actual_message["host"]
    assert_equal 'success', actual_message["status"]
    assert_equal 0, actual_message["connection_code"]
    assert_equal 0, actual_message["execution_code"]
  end

  test 'Outputs job finished message' do
    @generator.job_finished_message

    actual = @generator.generate
    actual_message = JSON.parse(actual)

    assert_equal "playbook_run_completed", actual_message["type"]
    assert_equal 3, actual_message["version"]
    assert_equal @correlation_id, actual_message["correlation_id"]
    assert_equal "success", actual_message["status"]
  end

  test 'Outputs a valid JSONL format' do
    @generator.host_finished_message('test_host1', 0)
    @generator.host_finished_message('test_host2', 0)

    actual = @generator.generate.lines
    actual_message1 = JSON.parse(actual[0])
    assert_equal 'test_host1', actual_message1['host']
    actual_message2 = JSON.parse(actual[1])
    assert_equal 'test_host2', actual_message2['host']
  end
end
