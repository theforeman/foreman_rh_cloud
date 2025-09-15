require 'test_plugin_helper'
require 'foreman_tasks/test_helpers'

class VmaasReposcanSyncTest < ActiveSupport::TestCase
  include ForemanTasks::TestHelpers::WithInThreadExecutor

  setup do
    @root = FactoryBot.build(:katello_root_repository, :fedora_17_x86_64_dev_root)
    @root.save(validate: false)
    @repo = FactoryBot.create(
      :katello_repository,
      :with_product,
      distribution_family: 'Red Hat',
      distribution_version: '7.5',
      root: @root
    )
    @repo_payload = { id: @repo.id }
    @expected_url = 'https://example.com/api/v1/vmaas/reposcan/sync'
    InsightsCloud.stubs(:vmaas_reposcan_sync_url).returns(@expected_url)
    ForemanRhCloud.stubs(:with_iop_smart_proxy?).returns(true)
  end

  # Planning behavior
  test 'plan plans_self when repo payload has id and IoP is available' do
    InsightsCloud::Async::VmaasReposcanSync.any_instance.expects(:plan_self).once

    ForemanTasks.sync_task(InsightsCloud::Async::VmaasReposcanSync, @repo_payload)
  end

  test 'plan does not plan_self when repo payload is missing id' do
    payload_without_id = {}

    mock_logger = mock('logger')
    mock_logger.expects(:error).with { |msg| msg =~ /missing repository id/i }
    InsightsCloud::Async::VmaasReposcanSync.any_instance.stubs(:logger).returns(mock_logger)
    InsightsCloud::Async::VmaasReposcanSync.any_instance.expects(:plan_self).never

    ForemanTasks.sync_task(InsightsCloud::Async::VmaasReposcanSync, payload_without_id)
  end

  test 'plan does not plan_self when IoP smart proxy is not available' do
    ForemanRhCloud.stubs(:with_iop_smart_proxy?).returns(false)

    InsightsCloud::Async::VmaasReposcanSync.any_instance.expects(:plan_self).never

    ForemanTasks.sync_task(InsightsCloud::Async::VmaasReposcanSync, @repo_payload)
  end

  test 'plan skips repo_id validation when IoP smart proxy is not available' do
    ForemanRhCloud.stubs(:with_iop_smart_proxy?).returns(false)
    payload_without_id = {}

    # Logger should not be called since IoP check returns early
    InsightsCloud::Async::VmaasReposcanSync.any_instance.expects(:logger).never
    InsightsCloud::Async::VmaasReposcanSync.any_instance.expects(:plan_self).never

    ForemanTasks.sync_task(InsightsCloud::Async::VmaasReposcanSync, payload_without_id)
  end

  test 'plan does not plan_self when repository is nil' do
    mock_logger = mock('logger')
    mock_logger.expects(:error).with { |msg| msg =~ /missing repository id/i }
    InsightsCloud::Async::VmaasReposcanSync.any_instance.stubs(:logger).returns(mock_logger)
    InsightsCloud::Async::VmaasReposcanSync.any_instance.expects(:plan_self).never

    ForemanTasks.sync_task(InsightsCloud::Async::VmaasReposcanSync, nil)
  end

  # Run behavior
  test 'run triggers VMaaS reposcan sync successfully' do
    mock_response = mock('response')
    mock_response.stubs(:code).returns(200)

    InsightsCloud::Async::VmaasReposcanSync.any_instance
                                           .expects(:execute_cloud_request)
                                           .with do |params|
      params[:method] == :put &&
        params[:url] == @expected_url &&
        params[:headers].is_a?(Hash) &&
        params[:headers]['Content-Type'] == 'application/json' &&
        params[:organization] == @repo.organization
    end
                                           .returns(mock_response)

    task = ForemanTasks.sync_task(InsightsCloud::Async::VmaasReposcanSync, @repo_payload)

    assert_equal 'VMaaS reposcan sync triggered successfully: 200', task.output[:message]
  end

  test 'run sets error message in task output for failed response' do
    mock_response = mock('response')
    mock_response.stubs(:code).returns(500)
    mock_response.stubs(:body).returns('Internal Server Error')

    InsightsCloud::Async::VmaasReposcanSync.any_instance
                                           .stubs(:execute_cloud_request)
                                           .returns(mock_response)

    task = ForemanTasks.sync_task(InsightsCloud::Async::VmaasReposcanSync, @repo_payload)

    assert_equal 'VMaaS reposcan sync failed with status: 500, body: Internal Server Error', task.output[:message]
  end

  test 'run sets error message in task output for RestClient exception' do
    error_response = mock('error_response')
    error_response.stubs(:code).returns(500)
    error_response.stubs(:body).returns('Server Error')
    exception = RestClient::ExceptionWithResponse.new(error_response)

    InsightsCloud::Async::VmaasReposcanSync.any_instance
                                           .stubs(:execute_cloud_request)
                                           .raises(exception)

    error = assert_raises(ForemanTasks::TaskError) do
      ForemanTasks.sync_task(InsightsCloud::Async::VmaasReposcanSync, @repo_payload)
    end

    assert_equal 'VMaaS reposcan sync failed: 500 - Server Error', error.task.output[:message]
  end

  test 'run sets error message in task output for StandardError exception' do
    InsightsCloud::Async::VmaasReposcanSync.any_instance
                                           .stubs(:execute_cloud_request)
                                           .raises(StandardError.new('Network timeout'))

    error = assert_raises(ForemanTasks::TaskError) do
      ForemanTasks.sync_task(InsightsCloud::Async::VmaasReposcanSync, @repo_payload)
    end

    # The task is available via main_action
    assert_match(/Error triggering VMaaS reposcan sync: Network timeout, response: /,
      error.task.main_action.output[:message])
  end

  test 'run logs and re-raises when cloud request returns error response' do
    error_response = mock('error_response', code: 500, body: 'error')
    exception = RestClient::ExceptionWithResponse.new(error_response)

    InsightsCloud::Async::VmaasReposcanSync.any_instance
                                           .stubs(:execute_cloud_request)
                                           .raises(exception)

    assert_raises(ForemanTasks::TaskError) do
      ForemanTasks.sync_task(InsightsCloud::Async::VmaasReposcanSync, @repo_payload)
    end
  end
end
