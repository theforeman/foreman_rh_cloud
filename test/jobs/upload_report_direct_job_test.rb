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
          'key' => 'FAKE KEY'
        }
      }
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

    action = create_and_plan_action(
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
end
