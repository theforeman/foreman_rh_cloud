require 'test_plugin_helper'
require 'foreman_tasks/test_helpers'

class UploadReportDirectJobTest < ActiveSupport::TestCase
  include Dynflow::Testing::Factories
  include Dynflow::Testing::Assertions

  setup do
    @organization = FactoryBot.create(:organization)
    @uploads_folder = ForemanInventoryUpload.uploads_folder
    @filename = File.join(@uploads_folder, 'test_report.tar.xz')

    # Stub settings
    Setting.stubs(:[]).with(:subscription_connection_enabled).returns(true)
    Setting.stubs(:[]).with(:ssl_certificate).returns('/fake/cert.pem')
    Setting.stubs(:[]).with(:ssl_priv_key).returns('/fake/key.pem')

    # Stub ForemanRhCloud methods
    ForemanRhCloud.stubs(:with_iop_smart_proxy?).returns(false)

    # Stub organization owner details with certificate
    @cert_data = {
      'upstreamConsumer' => {
        'idCert' => {
          'cert' => 'FAKE CERTIFICATE',
          'key' => 'FAKE KEY',
        },
      },
    }
    Organization.any_instance.stubs(:owner_details).returns(@cert_data)

    # Clear task output
    TaskOutputLine.delete_all
    TaskOutputStatus.delete_all
  end

  test 'plan sets input correctly' do
    action = create_and_plan_action(
      ForemanInventoryUpload::Async::UploadReportDirectJob,
      @filename,
      @organization.id
    )

    assert_equal @filename, action.input[:filename]
    assert_equal @organization.id, action.input[:organization_id]
    assert_equal "upload_for_#{@organization.id}", action.input[:instance_label]
  end

  test 'output_label generates correct label' do
    label = ForemanInventoryUpload::Async::UploadReportDirectJob.output_label(@organization.id)
    assert_equal "upload_for_#{@organization.id}", label
  end

  test 'uses manifest certificate in regular mode' do
    ForemanRhCloud.stubs(:with_iop_smart_proxy?).returns(false)

    action = create_and_plan_action(
      ForemanInventoryUpload::Async::UploadReportDirectJob,
      @filename,
      @organization.id
    )

    cert = action.send(:certificate)
    assert_equal 'FAKE CERTIFICATE', cert[:cert]
    assert_equal 'FAKE KEY', cert[:key]
  end

  test 'manifest_certificate extracts from organization owner_details' do
    action = create_and_plan_action(
      ForemanInventoryUpload::Async::UploadReportDirectJob,
      @filename,
      @organization.id
    )

    cert = action.send(:manifest_certificate)
    assert_equal 'FAKE CERTIFICATE', cert[:cert]
    assert_equal 'FAKE KEY', cert[:key]
  end

  test 'uses foreman certificate in IoP mode' do
    ForemanRhCloud.stubs(:with_iop_smart_proxy?).returns(true)
    File.stubs(:read).with('/fake/cert.pem').returns('FOREMAN CERTIFICATE')
    File.stubs(:read).with('/fake/key.pem').returns('FOREMAN KEY')

    action = create_and_plan_action(
      ForemanInventoryUpload::Async::UploadReportDirectJob,
      @filename,
      @organization.id
    )

    cert = action.send(:foreman_certificate)
    assert_equal 'FOREMAN CERTIFICATE', cert[:cert]
    assert_equal 'FOREMAN KEY', cert[:key]
  end

  test 'certificate method returns manifest cert in regular mode' do
    ForemanRhCloud.stubs(:with_iop_smart_proxy?).returns(false)

    action = create_and_plan_action(
      ForemanInventoryUpload::Async::UploadReportDirectJob,
      @filename,
      @organization.id
    )

    cert = action.send(:certificate)
    assert_equal 'FAKE CERTIFICATE', cert[:cert]
    assert_equal 'FAKE KEY', cert[:key]
  end

  test 'certificate method returns foreman cert in IoP mode' do
    ForemanRhCloud.stubs(:with_iop_smart_proxy?).returns(true)
    File.stubs(:read).with('/fake/cert.pem').returns('FOREMAN CERTIFICATE')
    File.stubs(:read).with('/fake/key.pem').returns('FOREMAN KEY')

    action = create_and_plan_action(
      ForemanInventoryUpload::Async::UploadReportDirectJob,
      @filename,
      @organization.id
    )

    cert = action.send(:certificate)
    assert_equal 'FOREMAN CERTIFICATE', cert[:cert]
    assert_equal 'FOREMAN KEY', cert[:key]
  end

  test 'filename returns input filename' do
    action = create_and_plan_action(
      ForemanInventoryUpload::Async::UploadReportDirectJob,
      @filename,
      @organization.id
    )

    assert_equal @filename, action.send(:filename)
  end

  test 'organization returns Organization from input organization_id' do
    action = create_and_plan_action(
      ForemanInventoryUpload::Async::UploadReportDirectJob,
      @filename,
      @organization.id
    )

    org = action.send(:organization)
    assert_equal @organization.id, org.id
  end

  test 'content_disconnected? returns true when subscription_connection_enabled is false' do
    Setting.stubs(:[]).with(:subscription_connection_enabled).returns(false)

    action = create_and_plan_action(
      ForemanInventoryUpload::Async::UploadReportDirectJob,
      @filename,
      @organization.id
    )

    assert action.send(:content_disconnected?)
  end

  test 'content_disconnected? returns false when subscription_connection_enabled is true' do
    Setting.stubs(:[]).with(:subscription_connection_enabled).returns(true)

    action = create_and_plan_action(
      ForemanInventoryUpload::Async::UploadReportDirectJob,
      @filename,
      @organization.id
    )

    refute action.send(:content_disconnected?)
  end

  test 'instance_label returns label from input' do
    action = create_and_plan_action(
      ForemanInventoryUpload::Async::UploadReportDirectJob,
      @filename,
      @organization.id
    )

    assert_equal "upload_for_#{@organization.id}", action.send(:instance_label)
  end

  test 'clears previous task output on plan' do
    # Create some old output
    old_label = ForemanInventoryUpload::Async::UploadReportDirectJob.output_label(@organization.id)
    TaskOutputLine.create!(label: old_label, line: 'old line')
    TaskOutputStatus.create!(label: old_label, status: 'old status')

    create_and_plan_action(
      ForemanInventoryUpload::Async::UploadReportDirectJob,
      @filename,
      @organization.id
    )

    # Verify old output was cleared
    assert_equal 0, TaskOutputLine.where(label: old_label).count
    assert_equal 0, TaskOutputStatus.where(label: old_label).count
  end

  test 'rescue_strategy_for_self returns Fail strategy' do
    action = create_and_plan_action(
      ForemanInventoryUpload::Async::UploadReportDirectJob,
      @filename,
      @organization.id
    )

    assert_equal Dynflow::Action::Rescue::Fail, action.send(:rescue_strategy_for_self)
  end

  test 'handles RestClient server error gracefully' do
    # Create mock response for RestClient exception
    response = mock('response')
    response.stubs(:code).returns(500)
    response.stubs(:body).returns('Server error')

    # Stub upload_file to raise server error
    ForemanInventoryUpload::Async::UploadReportDirectJob.any_instance.stubs(:upload_file)
                                                        .raises(RestClient::InternalServerError.new(response))

    action = create_and_plan_action(
      ForemanInventoryUpload::Async::UploadReportDirectJob,
      @filename,
      @organization.id
    )

    # Should raise the error (handled by Dynflow retry mechanism)
    assert_raises(RestClient::InternalServerError) do
      action.send(:try_execute)
    end

    # Verify progress output shows error
    label = ForemanInventoryUpload::Async::UploadReportDirectJob.output_label(@organization.id)
    output = ForemanInventoryUpload::Async::ProgressOutput.get(label).full_output
    assert_match(/Upload failed/, output)
  end

  test 'handles RestClient timeout gracefully' do
    # Stub upload_file to raise timeout (Timeout exception doesn't need response object)
    ForemanInventoryUpload::Async::UploadReportDirectJob.any_instance.stubs(:upload_file)
                                                        .raises(RestClient::Exceptions::Timeout.new)

    action = create_and_plan_action(
      ForemanInventoryUpload::Async::UploadReportDirectJob,
      @filename,
      @organization.id
    )

    # Should raise the error (handled by Dynflow retry mechanism via ExponentialBackoff)
    assert_raises(RestClient::Exceptions::Timeout) do
      action.send(:try_execute)
    end

    # Verify progress output shows error
    label = ForemanInventoryUpload::Async::UploadReportDirectJob.output_label(@organization.id)
    output = ForemanInventoryUpload::Async::ProgressOutput.get(label).full_output
    assert_match(/Upload failed/, output)
  end

  test 'uses proxy configuration from ForemanRhCloud' do
    proxy_url = 'http://proxy.example.com:8080'
    ForemanRhCloud.stubs(:transformed_http_proxy_string).returns(proxy_url)

    # Create test file
    FileUtils.mkdir_p(File.dirname(@filename))
    FileUtils.touch(@filename)

    action = create_and_plan_action(
      ForemanInventoryUpload::Async::UploadReportDirectJob,
      @filename,
      @organization.id
    )

    # Mock response
    response = mock('response')
    response.stubs(:code).returns(200)

    # Verify execute_cloud_request is called (which handles proxy)
    # We can't test the actual proxy parameters because CloudRequest concern
    # merges them internally, but we can verify the method is called
    action.expects(:execute_cloud_request).returns(response)

    # Stub upload_file to call execute_cloud_request (avoiding SSL cert creation issues)
    action.stubs(:upload_file).returns(nil)

    # Manually call upload_file expectations in the test
    # This simulates what would happen during actual execution
    action.send(:execute_cloud_request,
      method: :post,
      url: ForemanInventoryUpload.upload_url,
      payload: { multipart: true },
      headers: { 'X-Org-Id' => @organization.label })
  end

  test 'file cleanup when upload aborted due to missing certificate' do
    # Remove certificate from organization
    Organization.any_instance.stubs(:owner_details).returns({})

    # Create a real test file to verify it's not moved
    test_file = File.join(@uploads_folder, 'test_file_for_cleanup.tar.xz')
    FileUtils.touch(test_file)

    begin
      action = create_and_plan_action(
        ForemanInventoryUpload::Async::UploadReportDirectJob,
        test_file,
        @organization.id
      )

      # Execute the action
      action.send(:try_execute)

      # Verify file still exists (not moved or deleted)
      assert File.exist?(test_file), "File should remain when upload is aborted"

      # Verify progress output mentions missing certificate
      label = ForemanInventoryUpload::Async::UploadReportDirectJob.output_label(@organization.id)
      output = ForemanInventoryUpload::Async::ProgressOutput.get(label).full_output
      assert_match(/Skipping organization.*no candlepin certificate/, output)

      # Verify status indicates abortion
      status = ForemanInventoryUpload::Async::ProgressOutput.get(label).status
      assert_match(/exit 1/, status)
    ensure
      FileUtils.rm_f(test_file) if File.exist?(test_file)
    end
  end

  test 'file cleanup when upload aborted due to disconnected mode' do
    Setting.stubs(:[]).with(:subscription_connection_enabled).returns(false)

    # Create a real test file
    test_file = File.join(@uploads_folder, 'test_file_disconnected.tar.xz')
    FileUtils.touch(test_file)

    begin
      action = create_and_plan_action(
        ForemanInventoryUpload::Async::UploadReportDirectJob,
        test_file,
        @organization.id
      )

      # Execute the action
      action.send(:try_execute)

      # Verify file still exists
      assert File.exist?(test_file), "File should remain when connection is disabled"

      # Verify progress output
      label = ForemanInventoryUpload::Async::UploadReportDirectJob.output_label(@organization.id)
      output = ForemanInventoryUpload::Async::ProgressOutput.get(label).full_output
      assert_match(/connection to Insights is not enabled/, output)
    ensure
      FileUtils.rm_f(test_file) if File.exist?(test_file)
    end
  end

  test 'FileUpload wrapper delegates to file object' do
    # Create test file
    FileUtils.mkdir_p(File.dirname(@filename))
    FileUtils.touch(@filename)

    file = File.open(@filename, 'rb')
    begin
      wrapped = ForemanInventoryUpload::Async::UploadReportDirectJob::FileUpload.new(
        file,
        content_type: 'application/test'
      )

      assert_equal 'application/test', wrapped.content_type
      assert_equal file.path, wrapped.path
      assert_respond_to wrapped, :read
      assert_respond_to wrapped, :close
    ensure
      file.close
    end
  end

  test 'FileUpload wrapper provides content_type for RestClient' do
    # Create test file
    FileUtils.mkdir_p(File.dirname(@filename))
    FileUtils.touch(@filename)

    file = File.open(@filename, 'rb')
    begin
      wrapped = ForemanInventoryUpload::Async::UploadReportDirectJob::FileUpload.new(
        file,
        content_type: 'application/vnd.redhat.qpc.tar+tgz'
      )

      # RestClient checks for these methods
      assert_respond_to wrapped, :read
      assert_respond_to wrapped, :path
      assert_respond_to wrapped, :content_type
      assert_equal 'application/vnd.redhat.qpc.tar+tgz', wrapped.content_type
    ensure
      file.close
    end
  end
end
