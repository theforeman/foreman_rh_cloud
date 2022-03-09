require 'test_plugin_helper'

class FactHelpersTest < ActiveSupport::TestCase
  class FactsHelpersTestStub
    include ForemanInventoryUpload::Generators::FactHelpers
  end

  setup do
    @instance = FactsHelpersTestStub.new

    @org = FactoryBot.create(:organization)
  end

  test 'golden_ticket uses golden_ticket method when defined' do
    @org.expects(:golden_ticket?).returns(true)

    actual = @instance.golden_ticket?(@org)

    assert actual
  end

  test 'golden_ticket uses content_access_mode method when golden_ticket not defined' do
    @org.expects(:content_access_mode).returns('org_environment')

    actual = @instance.golden_ticket?(@org)

    assert actual
  end

  test 'obfuscates ips with insights-client data' do
    host = mock('host')
    @instance.expects(:fact_value).with(host, 'insights_client::ips').returns(
      '[{"obfuscated": "10.230.230.1", "original": "224.0.0.1"}, {"obfuscated": "10.230.230.255", "original": "224.0.0.251"}]'
    )

    actual = @instance.obfuscated_ips(host)

    assert_equal '10.230.230.1', actual['224.0.0.1']
    assert_equal '10.230.231.0', actual['224.0.0.2']
  end

  test 'obfuscates ips without insights-client data' do
    host = mock('host')
    @instance.expects(:fact_value).with(host, 'insights_client::ips').returns(nil)

    actual = @instance.obfuscated_ips(host)

    assert_equal '10.230.230.1', actual['224.0.0.1']
    assert_equal '10.230.230.2', actual['224.0.0.2']
  end
end
