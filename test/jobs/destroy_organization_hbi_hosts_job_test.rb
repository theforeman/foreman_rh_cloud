require 'test_plugin_helper'
require 'foreman_tasks/test_helpers'

class DestroyOrganizationHbiHostsJobTest < ActiveSupport::TestCase
  include Dynflow::Testing::Factories

  setup do
    User.current = User.find_by(login: 'secret_admin')

    Organization.any_instance.stubs(:manifest_expired?).returns(false)
    @org = FactoryBot.create(:organization)
  end

  teardown do
    ForemanRhCloud.unstub(:with_iop_smart_proxy?)
  end

  test 'Deletes all HBI hosts for organization in IoP mode' do
    ForemanRhCloud.stubs(:with_iop_smart_proxy?).returns(true)

    expected_url = ForemanInventoryUpload.hosts_delete_all_url

    ForemanInventoryUpload::Async::DestroyOrganizationHbiHostsJob.any_instance.expects(:execute_cloud_request).with do |params|
      params[:organization] == @org &&
        params[:method] == :delete &&
        params[:url] == expected_url &&
        params[:headers][:content_type] == :json
    end.returns(mock_response)

    action = create_and_plan_action(ForemanInventoryUpload::Async::DestroyOrganizationHbiHostsJob, @org.id)
    action = run_action(action)

    assert_match(/Successfully deleted/, action.output[:result])
  end

  test 'Skips HBI deletion when not in IoP mode' do
    ForemanRhCloud.stubs(:with_iop_smart_proxy?).returns(false)

    ForemanInventoryUpload::Async::DestroyOrganizationHbiHostsJob.any_instance.expects(:execute_cloud_request).never

    action = create_and_plan_action(ForemanInventoryUpload::Async::DestroyOrganizationHbiHostsJob, @org.id)
    action = run_action(action)

    assert_match(/not in IoP mode/, action.output[:result])
  end

  test 'Handles RestClient::NotFound gracefully' do
    ForemanRhCloud.stubs(:with_iop_smart_proxy?).returns(true)

    ForemanInventoryUpload::Async::DestroyOrganizationHbiHostsJob.any_instance.expects(:execute_cloud_request).raises(RestClient::NotFound)

    action = create_and_plan_action(ForemanInventoryUpload::Async::DestroyOrganizationHbiHostsJob, @org.id)
    action = run_action(action)

    assert_match(/No HBI hosts found/, action.output[:result])
  end

  test 'Raises on other errors' do
    ForemanRhCloud.stubs(:with_iop_smart_proxy?).returns(true)

    ForemanInventoryUpload::Async::DestroyOrganizationHbiHostsJob.any_instance.expects(:execute_cloud_request).raises(
      RestClient::InternalServerError.new
    )

    action = create_and_plan_action(ForemanInventoryUpload::Async::DestroyOrganizationHbiHostsJob, @org.id)

    assert_raises(RestClient::InternalServerError) do
      run_action(action)
    end
  end

  test 'hosts_delete_all_url returns correct format' do
    url = ForemanInventoryUpload.hosts_delete_all_url

    assert_match %r{/hosts/all\?confirm_delete_all=true$}, url
  end

  def mock_response(code: 200, body: '')
    response = mock('response')
    response.stubs(:code).returns(code)
    response.stubs(:body).returns(body)
    response
  end
end
