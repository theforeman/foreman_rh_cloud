require 'test_plugin_helper'

class CloudStatusServiceTest < ActiveSupport::TestCase
  include MockCerts

  setup do
  end

  test 'generates ping response for each org' do
    organizations = FactoryBot.create_list(:organization, 2)

    ForemanRhCloud::CloudPingService::TokenPing.any_instance.expects(:execute_cloud_request).returns(
      RestClient::Response.new('TEST RESPONSE')
    )

    setup_certs_expectation do
      ForemanRhCloud::CloudPingService::CertPing.any_instance.expects(:candlepin_id_cert).with(organizations[0])
    end
    ForemanRhCloud::CloudPingService::CertPing.any_instance.expects(:execute_cloud_request).returns(
      RestClient::Response.new('TEST RESPONSE ORG 0')
    )

    setup_certs_expectation do
      ForemanRhCloud::CloudPingService::CertPing.any_instance.expects(:candlepin_id_cert).with(organizations[1])
    end

    ForemanRhCloud::CloudPingService::CertPing.any_instance.expects(:execute_cloud_request).returns(
      RestClient::Response.new('TEST RESPONSE ORG 1')
    )

    Katello::UpstreamConnectionChecker.any_instance.expects(:assert_connection).twice.returns(true)

    service = ForemanRhCloud::CloudPingService.new(organizations, nil)
    actual = service.ping

    assert actual[:token_auth][:success]
    assert_nil actual[:token_auth][:error]
    assert actual[:cert_auth][organizations[0]][:success]
    assert_nil actual[:cert_auth][organizations[0]][:error]
    assert actual[:cert_auth][organizations[1]][:success]
    assert_nil actual[:cert_auth][organizations[1]][:error]
  end

  test 'generates ping error response for org and token' do
    organizations = FactoryBot.create_list(:organization, 1)

    ForemanRhCloud::CloudPingService::TokenPing.any_instance.expects(:execute_cloud_request).raises(
      RuntimeError,
      'TEST RESPONSE TOKEN'
    )

    setup_certs_expectation do
      ForemanRhCloud::CloudPingService::CertPing.any_instance.expects(:candlepin_id_cert).with(organizations[0])
    end
    ForemanRhCloud::CloudPingService::CertPing.any_instance.expects(:execute_cloud_request).raises(
      RuntimeError,
      'TEST RESPONSE ORG 0'
    )

    Katello::UpstreamConnectionChecker.any_instance.expects(:assert_connection).returns(true)

    service = ForemanRhCloud::CloudPingService.new(organizations, nil)
    actual = service.ping

    refute actual[:token_auth][:success]
    assert_match /TEST RESPONSE TOKEN/, actual[:token_auth][:error]
    refute actual[:cert_auth][organizations[0]][:success]
    assert_match /TEST RESPONSE ORG 0/, actual[:cert_auth][organizations[0]][:error]
  end
end
