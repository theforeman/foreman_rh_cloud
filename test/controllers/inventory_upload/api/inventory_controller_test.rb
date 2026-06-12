require 'test_plugin_helper'

module InventoryUpload::Api
  class InventoryControllerTest < ActionController::TestCase
    tests Api::V2::RhCloud::InventoryController

    setup do
      @test_org = FactoryBot.create(:organization)
      @disconnected = false
    end

    test 'Starts report generation' do
      Api::V2::RhCloud::InventoryController.any_instance
        .expects(:start_report_generation)
        .with(@test_org.id.to_s, @disconnected)

      post :generate_report, params: { organization_id: @test_org.id, no_upload: @disconnected }

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

    test 'Triggers Sources announcement task' do
      test_task = FactoryBot.create(:some_task)

      ForemanTasks.expects(:async_task)
        .with(InsightsCloud::Async::CloudConnectorAnnounceTask, true)
        .returns(test_task)

      post :announce_to_sources

      assert_response :success

      actual_task = @response.parsed_body['task']
      assert_not_nil actual_task
      assert_equal test_task.id.to_s, actual_task['id']
    end
  end
end
