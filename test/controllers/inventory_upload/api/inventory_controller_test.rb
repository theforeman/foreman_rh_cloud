require 'test_plugin_helper'

module InventoryUpload::Api
  class InventoryControllerTest < ActionController::TestCase
    tests Api::V2::RhCloud::InventoryController

    setup do
      @test_org = FactoryBot.create(:organization)
    end

    test 'Starts report generation' do
      Api::V2::RhCloud::InventoryController.any_instance
        .expects(:start_report_generation)
        .with(@test_org.id.to_s)

      post :generate_report, params: { organization_id: @test_org.id }

      assert_response :success
    end

    test 'Starts inventory sync action' do
      test_task = FactoryBot.create(:some_task)

      Api::V2::RhCloud::InventoryController.any_instance
        .expects(:start_inventory_sync)
        .with() { |actual_org| @test_org.id == actual_org.id }
        .returns(test_task)

      post :sync_inventory_status, params: { organization_id: @test_org.id }

      assert_response :success

      assert_not_nil(actual_task = @response.parsed_body['task'])
      assert_equal test_task.id.to_s, actual_task['id']
    end

    test 'Starts cloud connector configuration job' do
      test_job = FactoryBot.create(:job_invocation)

      ForemanRhCloud::CloudConnector.any_instance
        .expects(:install)
        .returns(test_job)

      post :enable_cloud_connector

      assert_response :success

      actual_job = @response.parsed_body

      assert_equal test_job.id, actual_job['id']
    end
  end
end
