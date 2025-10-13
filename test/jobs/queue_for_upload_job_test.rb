require 'test_plugin_helper'
require 'foreman_tasks/test_helpers'

class QueueForUploadJobTest < ActiveSupport::TestCase
  include Dynflow::Testing::Factories

  let(:organization) { FactoryBot.create(:organization) }
  let(:base_folder) { Dir.mktmpdir }
  let(:report_file) { 'test_report.tar.xz' }
  let(:report_path) { File.join(base_folder, report_file) }
  let(:uploads_folder) { ForemanInventoryUpload.uploads_folder }

  setup do
    # Stub the script template source
    script_source = File.join(ForemanRhCloud::Engine.root, 'lib/foreman_inventory_upload/scripts/uploader.sh.erb')
    File.stubs(:read).with(script_source).returns('#!/bin/bash\necho "Test script"')

    # Stub template rendering
    Foreman::Renderer.stubs(:render).returns('#!/bin/bash\necho "Rendered script"')

    # Stub additional settings that are accessed
    Setting.stubs(:[]).with(:content_default_http_proxy).returns(nil)
    Setting.stubs(:[]).with(:http_proxy).returns(nil)
    Setting.stubs(:[]).with("foreman_tasks_sync_task_timeout").returns(120)
    FileUtils.touch(report_path)
  end

  teardown do
    FileUtils.rm_rf(uploads_folder) if Dir.exist?(uploads_folder)
    FileUtils.remove_entry base_folder if Dir.exist?(base_folder)
  end

  test 'plan method sets up the job correctly and calls plan_upload_report' do
    # Mock plan_upload_report to verify it's called
    ForemanInventoryUpload::Async::QueueForUploadJob.any_instance.expects(:plan_upload_report).once

    action = create_and_plan_action(ForemanInventoryUpload::Async::QueueForUploadJob, base_folder, report_file, organization.id)
    run_action(action)
  end

  test 'run method processes file and moves it to uploads folder' do
    ForemanInventoryUpload::Async::QueueForUploadJob.any_instance.stubs(:plan_upload_report)

    action = create_and_plan_action(ForemanInventoryUpload::Async::QueueForUploadJob, base_folder, report_file, organization.id)
    run_action(action)

    # Verify the file was moved
    refute File.exist?(report_path), "Original file should be moved"
    assert File.exist?(File.join(uploads_folder, report_file)), "File should exist in uploads folder"
  end

  test 'creates necessary folders and scripts' do
    ForemanInventoryUpload::Async::QueueForUploadJob.any_instance.stubs(:plan_upload_report)

    action = create_and_plan_action(ForemanInventoryUpload::Async::QueueForUploadJob, base_folder, report_file, organization.id)
    run_action(action)

    # Verify the uploads folder was created
    assert Dir.exist?(uploads_folder), "Uploads folder should be created"

    # Verify the script file was created
    script_path = File.join(uploads_folder, ForemanInventoryUpload.upload_script_file)
    assert File.exist?(script_path), "Upload script should be created"
  end
end
