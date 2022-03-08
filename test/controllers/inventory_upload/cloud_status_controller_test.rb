require 'test_plugin_helper'

class CloudStatusControllerTest < ActionController::TestCase
  include MockCerts
  tests ForemanInventoryUpload::CloudStatusController

  test 'return ping status hash for each organization' do
    organizations = FactoryBot.create_list(:organization, 2)
    user = users(:admin)
    User.stubs(:current).returns(user)
    user.stubs(:my_organizations).returns(organizations)

    ForemanRhCloud::CloudPingService::TokenPing.any_instance.expects(:execute_cloud_request).returns(
      RestClient::Response.new('TEST RESPONSE')
    )

    setup_certs_expectation do
      ForemanRhCloud::CloudPingService::CertPing.any_instance.expects(:candlepin_id_cert).with { |actual| actual.id == organizations[0].id }
    end
    ForemanRhCloud::CloudPingService::CertPing.any_instance.expects(:execute_cloud_request).returns(
      RestClient::Response.new('TEST RESPONSE ORG 0')
    )

    setup_certs_expectation do
      ForemanRhCloud::CloudPingService::CertPing.any_instance.expects(:candlepin_id_cert).with { |actual| actual.id == organizations[1].id }
    end

    ForemanRhCloud::CloudPingService::CertPing.any_instance.expects(:execute_cloud_request).returns(
      RestClient::Response.new('TEST RESPONSE ORG 1')
    )

    Katello::UpstreamConnectionChecker.any_instance.expects(:assert_connection).twice.returns(true)

    get :index, session: set_session_user

    assert_response :success
    actual = JSON.parse(response.body)
    assert_not_nil (actual_ping = actual['ping'])
    assert actual_ping['token_auth']['success']
    assert_nil actual_ping['token_auth']['error']
    assert actual_ping['cert_auth'][0]['success']
    assert_nil actual_ping['cert_auth'][0]['error']
    assert actual_ping['cert_auth'][1]['success']
    assert_nil actual_ping['cert_auth'][1]['error']
  end
end
