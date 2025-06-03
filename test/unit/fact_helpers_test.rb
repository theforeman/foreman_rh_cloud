require 'test_plugin_helper'
require 'digest'

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
    @instance.expects(:fact_value).with(host, 'insights_client::obfuscated_ipv4').returns(
      '[{"obfuscated": "10.230.230.1", "original": "224.0.0.1"}, {"obfuscated": "10.230.230.255", "original": "224.0.0.251"}]'
    )

    actual = @instance.obfuscated_ips(host)

    assert_equal '10.230.230.1', actual['224.0.0.1']
    assert_equal '10.230.231.0', actual['224.0.0.2']
  end

  test 'obfuscates ips without insights-client data' do
    host = mock('host')
    @instance.expects(:fact_value).with(host, 'insights_client::obfuscated_ipv4').returns(nil)

    actual = @instance.obfuscated_ips(host)

    assert_equal '10.230.230.1', actual['224.0.0.1']
    assert_equal '10.230.230.2', actual['224.0.0.2']
  end

  describe 'obfuscate_hostname?' do
    test 'returns true when global setting is enabled' do
      Setting.expects(:[]).with(:obfuscate_inventory_hostnames).returns(true)
      host = mock('host')

      result = @instance.obfuscate_hostname?(host)

      assert result
    end

    test 'returns false when global setting is disabled and no host-specific setting' do
      Setting.expects(:[]).with(:obfuscate_inventory_hostnames).returns(false)
      host = mock('host')
      @instance.expects(:fact_value).with(host, 'insights_client::obfuscate_hostname_enabled').returns(nil)

      result = @instance.obfuscate_hostname?(host)

      refute result
    end

    test 'returns true when host-specific setting is enabled' do
      Setting.expects(:[]).with(:obfuscate_inventory_hostnames).returns(false)
      host = mock('host')
      @instance.expects(:fact_value).with(host, 'insights_client::obfuscate_hostname_enabled').returns('true')

      result = @instance.obfuscate_hostname?(host)

      assert result
    end

    test 'returns false when host-specific setting is disabled' do
      Setting.expects(:[]).with(:obfuscate_inventory_hostnames).returns(false)
      host = mock('host')
      @instance.expects(:fact_value).with(host, 'insights_client::obfuscate_hostname_enabled').returns('false')

      result = @instance.obfuscate_hostname?(host)

      refute result
    end
  end

  describe 'fqdn' do
    test 'returns original fqdn when obfuscation is disabled' do
      host = mock('host')
      host.expects(:fqdn).returns('test.example.com')
      @instance.expects(:obfuscate_hostname?).with(host).returns(false)

      result = @instance.fqdn(host)

      assert_equal 'test.example.com', result
    end

    test 'returns obfuscated hostname from insights_client fact when available' do
      host = mock('host')
      host.expects(:fqdn).returns('test.example.com').once
      @instance.expects(:obfuscate_hostname?).with(host).returns(true)
      @instance.expects(:fact_value).with(host, 'insights_client::obfuscated_hostname').returns(
        '[{"original": "test.example.com", "obfuscated": "abc123.example.com"}]'
      )

      result = @instance.fqdn(host)

      assert_equal 'abc123.example.com', result
    end

    test 'returns dynamically obfuscated hostname when insights_client fact is not available' do
      host = mock('host')
      host.stubs(:fqdn).returns('test.example.com')
      @instance.expects(:obfuscate_hostname?).with(host).returns(true)
      @instance.expects(:fact_value).with(host, 'insights_client::obfuscated_hostname').returns(nil)

      result = @instance.fqdn(host)

      expected = "#{Digest::SHA1.hexdigest('test.example.com')}.example.com"
      assert_equal expected, result
    end

    test 'returns dynamically obfuscated hostname when insights_client fact does not contain matching host' do
      host = mock('host')
      host.expects(:fqdn).returns('test.example.com').twice
      @instance.expects(:obfuscate_hostname?).with(host).returns(true)
      @instance.expects(:fact_value).with(host, 'insights_client::obfuscated_hostname').returns(
        '[{"original": "other.example.com", "obfuscated": "abc123.example.com"}]'
      )
      @instance.expects(:obfuscate_fqdn).with('test.example.com').returns('dynamically_obfuscated.example.com')

      result = @instance.fqdn(host)

      assert_equal 'dynamically_obfuscated.example.com', result
    end

    test 'handles invalid JSON in insights_client fact gracefully' do
      host = mock('host')
      host.stubs(:fqdn).returns('test.example.com')
      @instance.expects(:obfuscate_hostname?).with(host).returns(true)
      @instance.expects(:fact_value).with(host, 'insights_client::obfuscated_hostname').returns('invalid json')

      result = @instance.fqdn(host)

      expected = "#{Digest::SHA1.hexdigest('test.example.com')}.example.com"
      assert_equal expected, result
    end

    test 'handles empty insights_client fact' do
      host = mock('host')
      host.stubs(:fqdn).returns('test.example.com')
      @instance.expects(:obfuscate_hostname?).with(host).returns(true)
      @instance.expects(:fact_value).with(host, 'insights_client::obfuscated_hostname').returns('[]')

      result = @instance.fqdn(host)

      expected = "#{Digest::SHA1.hexdigest('test.example.com')}.example.com"
      assert_equal expected, result
    end
  end

  describe 'obfuscate_ips?' do
    test 'returns true when global setting is enabled' do
      Setting.expects(:[]).with(:obfuscate_inventory_ips).returns(true)
      host = mock('host')

      result = @instance.obfuscate_ips?(host)

      assert result
    end

    test 'returns false when global setting is disabled and no host-specific settings' do
      Setting.expects(:[]).with(:obfuscate_inventory_ips).returns(false)
      host = mock('host')
      @instance.expects(:fact_value).with(host, 'insights_client::obfuscate_ipv4_enabled').returns(nil)
      @instance.expects(:fact_value).with(host, 'insights_client::obfuscate_ipv6_enabled').returns(nil)

      result = @instance.obfuscate_ips?(host)

      refute result
    end

    test 'returns true when host-specific IPv4 setting is enabled' do
      Setting.expects(:[]).with(:obfuscate_inventory_ips).returns(false)
      host = mock('host')
      @instance.expects(:fact_value).with(host, 'insights_client::obfuscate_ipv4_enabled').returns('true')
      @instance.expects(:fact_value).with(host, 'insights_client::obfuscate_ipv6_enabled').returns(nil)

      result = @instance.obfuscate_ips?(host)

      assert result
    end

    test 'returns true when host-specific IPv6 setting is enabled' do
      Setting.expects(:[]).with(:obfuscate_inventory_ips).returns(false)
      host = mock('host')
      @instance.expects(:fact_value).with(host, 'insights_client::obfuscate_ipv4_enabled').returns(nil)
      @instance.expects(:fact_value).with(host, 'insights_client::obfuscate_ipv6_enabled').returns('true')

      result = @instance.obfuscate_ips?(host)

      assert result
    end

    test 'returns true when both IPv4 and IPv6 settings are enabled' do
      Setting.expects(:[]).with(:obfuscate_inventory_ips).returns(false)
      host = mock('host')
      @instance.expects(:fact_value).with(host, 'insights_client::obfuscate_ipv4_enabled').returns('true')
      @instance.expects(:fact_value).with(host, 'insights_client::obfuscate_ipv6_enabled').returns('true')

      result = @instance.obfuscate_ips?(host)

      assert result
    end

    test 'returns false when both IPv4 and IPv6 settings are disabled' do
      Setting.expects(:[]).with(:obfuscate_inventory_ips).returns(false)
      host = mock('host')
      @instance.expects(:fact_value).with(host, 'insights_client::obfuscate_ipv4_enabled').returns('false')
      @instance.expects(:fact_value).with(host, 'insights_client::obfuscate_ipv6_enabled').returns('false')

      result = @instance.obfuscate_ips?(host)

      refute result
    end
  end

  describe 'obfuscate_ip' do
    test 'generates first IP when no existing obfuscated IPs' do
      ips_dict = {}

      result = @instance.obfuscate_ip('192.168.1.1', ips_dict)

      assert_equal '10.230.230.1', result
    end

    test 'generates next sequential IP when existing obfuscated IPs present' do
      ips_dict = { '192.168.1.1' => '10.230.230.5', '192.168.1.2' => '10.230.230.10' }

      result = @instance.obfuscate_ip('192.168.1.3', ips_dict)

      assert_equal '10.230.230.11', result
    end

    test 'handles mixed IP ranges correctly' do
      ips_dict = { '192.168.1.1' => '10.230.230.255', '192.168.1.2' => '10.230.230.1' }

      result = @instance.obfuscate_ip('192.168.1.3', ips_dict)

      assert_equal '10.230.231.0', result
    end

    test 'generates valid IP addresses' do
      ips_dict = {}

      result = @instance.obfuscate_ip('any.ip.address', ips_dict)

      assert_match(/\A\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\z/, result)
      assert_nothing_raised { IPAddr.new(result) }
    end
  end

  describe 'obfuscated_ips' do
    test 'handles invalid JSON in insights_client fact gracefully' do
      host = mock('host')
      @instance.expects(:fact_value).with(host, 'insights_client::obfuscated_ipv4').returns('invalid json')

      result = @instance.obfuscated_ips(host)

      assert_equal '10.230.230.1', result['192.168.1.1']
    end

    test 'handles empty insights_client fact' do
      host = mock('host')
      @instance.expects(:fact_value).with(host, 'insights_client::obfuscated_ipv4').returns('[]')

      result = @instance.obfuscated_ips(host)

      assert_equal '10.230.230.1', result['192.168.1.1']
    end

    test 'preserves existing obfuscated IPs and generates new ones' do
      host = mock('host')
      @instance.expects(:fact_value).with(host, 'insights_client::obfuscated_ipv4').returns(
        '[{"original": "192.168.1.1", "obfuscated": "10.230.230.5"}]'
      )

      result = @instance.obfuscated_ips(host)

      assert_equal '10.230.230.5', result['192.168.1.1']
      assert_equal '10.230.230.6', result['192.168.1.2']
    end

    test 'default_proc generates unique sequential IPs' do
      host = mock('host')
      @instance.expects(:fact_value).with(host, 'insights_client::obfuscated_ipv4').returns(nil)

      result = @instance.obfuscated_ips(host)

      ip1 = result['192.168.1.1']
      ip2 = result['192.168.1.2']
      ip3 = result['192.168.1.3']

      assert_equal '10.230.230.1', ip1
      assert_equal '10.230.230.2', ip2
      assert_equal '10.230.230.3', ip3
    end
  end
end
