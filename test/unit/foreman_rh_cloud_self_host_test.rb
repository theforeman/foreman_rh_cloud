require 'test_plugin_helper'

class ForemanRhCloudSelfHostTest < ActiveSupport::TestCase
  setup do
    # reset cached value - must remove the variable entirely, not just set to nil
    ForemanRhCloud.remove_instance_variable(:@foreman_host) if ForemanRhCloud.instance_variable_defined?(:@foreman_host)
  end

  test 'finds host by fullname' do
    @domain
    @host = FactoryBot.create(:host, :managed)
    ForemanRhCloud.expects(:foreman_host_name).returns(@host.name)

    actual = ForemanRhCloud.foreman_host

    assert_not_nil actual
  end

  test 'finds host by shortname' do
    @host = FactoryBot.create(:host, :managed)
    Host.where(name: @host.name).update_all(name: @host.shortname)
    ForemanRhCloud.expects(:foreman_host_name).returns(@host.name)

    actual = ForemanRhCloud.foreman_host

    assert_not_nil actual
  end

  test 'finds host by infrastructure facet' do
    ENV.delete('SATELLITE_RH_CLOUD_FOREMAN_HOST')
    @host = FactoryBot.create(:host, :managed, :with_infrastructure_facet)
    actual = ForemanRhCloud.foreman_host

    assert_equal @host, actual
  end

  test 'returns nil when host does not exist' do
    ForemanRhCloud.expects(:foreman_host_name).returns('nonexistent.example.com')

    actual = ForemanRhCloud.foreman_host

    assert_nil actual
  end

  test 'returns nil and does not query Host when foreman_host_name is nil' do
    ForemanRhCloud.stubs(:foreman_host_name).returns(nil)
    ::Host.unscoped.friendly.expects(:where).never

    assert_nil ForemanRhCloud.foreman_host
  end

  test 'caches nil value to avoid repeated lookups' do
    ForemanRhCloud.expects(:foreman_host_name).once.returns('nonexistent.example.com')

    # Call twice, should only query once
    ForemanRhCloud.foreman_host
    ForemanRhCloud.foreman_host
  end

  test 'extracts hostname from foreman_url setting' do
    Setting[:foreman_url] = 'https://satellite.example.com'

    actual = ForemanRhCloud.foreman_url_hostname

    assert_equal 'satellite.example.com', actual
  end

  test 'handles invalid foreman_url gracefully' do
    # Stub Setting to return invalid URL without validation
    Setting.stubs(:[]).with(:foreman_url).returns('not a valid url')

    actual = ForemanRhCloud.foreman_url_hostname

    assert_nil actual
  end

  test 'foreman_host_name uses foreman_url when SmartProxy not available' do
    # Clear ENV variable that might interfere
    ENV.delete('SATELLITE_RH_CLOUD_FOREMAN_HOST')
    ForemanRhCloud.expects(:marked_foreman_host).returns(nil)
    ForemanRhCloud.expects(:foreman_url_hostname).returns('satellite.example.com')

    actual = ForemanRhCloud.foreman_host_name

    assert_equal 'satellite.example.com', actual
  end
end
