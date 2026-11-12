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

    test 'streams the latest report from Active Storage' do
      report = ForemanInventoryUpload::Report.create!(
        organization: @test_org,
        filename: ForemanInventoryUpload.facts_archive_name(@test_org.id),
        sha256: Digest::SHA256.hexdigest('inventory archive')
      )
      report.archive.attach(
        io: StringIO.new('inventory archive'),
        filename: report.filename,
        content_type: 'application/x-xz'
      )

      get :download_file, params: { organization_id: @test_org.id }

      assert_response :success
      assert_equal 'inventory archive', response.body
      assert_equal 'application/x-xz', response.media_type
      assert_includes response.headers['Content-Disposition'], report.filename
    end

    test 'does not look up archives outside the callers organizations' do
      User.any_instance.stubs(:my_organizations).returns(Organization.where(id: -1))
      ForemanInventoryUpload::Report.expects(:where).never
      get :download_file, params: { organization_id: @test_org.id }
      assert_response :not_found
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

      post :announce_to_sources, params: { instance_id: 'test-instance-id' }

      assert_response :success

      assert_equal 'test-instance-id', Setting[:rhc_instance_id]

      actual_task = @response.parsed_body['task']
      assert_not_nil actual_task
      assert_equal test_task.id.to_s, actual_task['id']
    end
  end
end
