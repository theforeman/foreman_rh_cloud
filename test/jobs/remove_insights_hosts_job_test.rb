require 'test_plugin_helper'
require 'foreman_tasks/test_helpers'

class RemoveInsightsHostJobTest < ActiveSupport::TestCase
  include ForemanTasks::TestHelpers::WithInThreadExecutor

  setup do
    User.current = User.find_by(login: 'secret_admin')

    Organization.any_instance.stubs(:manifest_expired?).returns(false)
    @org = FactoryBot.create(:organization)
  end

  test 'Deletes host records on cloud success' do
    ForemanInventoryUpload::Async::RemoveInsightsHostsJob.any_instance.expects(:execute_cloud_request).returns(
      mock_response
    )

    FactoryBot.create(:insights_missing_host, organization: @org)

    task = ForemanTasks.sync_task(ForemanInventoryUpload::Async::RemoveInsightsHostsJob, '', @org.id)

    assert_equal 0, InsightsMissingHost.count
    assert_equal 'success', task.result
  end

  test 'Does not delete hosts on cloud failure' do
    ForemanInventoryUpload::Async::RemoveInsightsHostsJob.any_instance.expects(:execute_cloud_request).raises(
      RestClient::Exceptions::EXCEPTIONS_MAP.fetch(500).new(mock_response(code: 500), 500)
    )

    FactoryBot.create(:insights_missing_host, organization: @org)

    begin
      ForemanTasks.sync_task(ForemanInventoryUpload::Async::RemoveInsightsHostsJob, '', @org.id)
    rescue ForemanTasks::TaskError => ex
      task = ex.task
    end

    assert_equal 1, InsightsMissingHost.count
    assert_equal 'error', task.result
  end

  test 'Paginates the hosts list' do
    ForemanInventoryUpload::Async::RemoveInsightsHostsJob.any_instance.stubs(:page_size).returns(1)

    ForemanInventoryUpload::Async::RemoveInsightsHostsJob.any_instance.expects(:execute_cloud_request).returns(
      mock_response(body: 'response2')
    )
    ForemanInventoryUpload::Async::RemoveInsightsHostsJob.any_instance.expects(:execute_cloud_request).returns(
      mock_response(body: 'response1')
    )

    FactoryBot.create(:insights_missing_host, organization: @org)
    FactoryBot.create(:insights_missing_host, organization: @org)

    task = ForemanTasks.sync_task(ForemanInventoryUpload::Async::RemoveInsightsHostsJob, '', @org.id)

    assert_equal 0, InsightsMissingHost.count
    assert_equal 'success', task.result
    assert_equal 'response1', task.output[:response_page1]
    assert_equal 'response2', task.output[:response_page2]
  end

  test 'Uses scoped_search to select hosts' do
    ForemanInventoryUpload::Async::RemoveInsightsHostsJob.any_instance.stubs(:page_size).returns(1)

    # Since the request is paginated per 1 host, I would expect only one call to execute_cloud_request
    ForemanInventoryUpload::Async::RemoveInsightsHostsJob.any_instance.expects(:execute_cloud_request).returns(
      mock_response(body: 'response1')
    )

    FactoryBot.create(:insights_missing_host, name: 'test a', organization: @org)
    FactoryBot.create(:insights_missing_host, name: 'test b', organization: @org)

    task = ForemanTasks.sync_task(ForemanInventoryUpload::Async::RemoveInsightsHostsJob, 'name ~ b', @org.id)

    assert_equal 1, InsightsMissingHost.count
    assert_equal 'test a', InsightsMissingHost.first.name
    assert_equal 'success', task.result
    assert_equal 'response1', task.output[:response_page1]
  end

  def mock_response(code: 200, body: '')
    response = mock('response')
    response.stubs(:code).returns(code)
    response.stubs(:body).returns(body)
    response
  end
end
