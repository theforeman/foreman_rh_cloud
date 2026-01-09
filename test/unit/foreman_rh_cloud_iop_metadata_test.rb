require 'test_plugin_helper'

class ForemanRhCloudIopMetadataTest < ActiveSupport::TestCase
  setup do
    # Clean up any existing IoP smart proxies
    SmartProxy.unscoped.with_features('iop').destroy_all
  end

  teardown do
    # Clean up
    SmartProxy.unscoped.with_features('iop').destroy_all
  end

  def create_iop_proxy(url: 'https://iop.example.com')
    feature = Feature.find_or_create_by(name: 'iop')
    proxy = FactoryBot.create(:smart_proxy, :url => url)
    # Clear any existing associations for this feature
    feature.reload
    feature.smart_proxies.clear
    proxy.features << feature
    proxy
  end

  describe 'plugin metadata' do
    test 'iop metadata is false when no IoP smart proxy exists' do
      # Ensure no IoP proxy exists
      refute ForemanRhCloud.with_iop_smart_proxy?

      # Plugin metadata should reflect this
      metadata = ::Foreman::Plugin.app_metadata_registry.all_plugin_metadata[:foreman_rh_cloud]

      # The value is a lambda, so we need to call it
      assert_kind_of Proc, metadata[:iop]
      refute metadata[:iop].call
    end

    test 'iop metadata is true when IoP smart proxy exists' do
      # Create an IoP smart proxy
      create_iop_proxy

      # Verify proxy exists
      assert ForemanRhCloud.with_iop_smart_proxy?

      # Plugin metadata should reflect this
      metadata = ::Foreman::Plugin.app_metadata_registry.all_plugin_metadata[:foreman_rh_cloud]

      # The value is a lambda, so we need to call it
      assert_kind_of Proc, metadata[:iop]
      assert metadata[:iop].call
    end

    test 'iop metadata updates when IoP smart proxy is created' do
      # Initially no IoP proxy
      metadata = ::Foreman::Plugin.app_metadata_registry.all_plugin_metadata[:foreman_rh_cloud]
      refute metadata[:iop].call

      # Create an IoP smart proxy
      create_iop_proxy

      # Metadata should now return true
      assert metadata[:iop].call
    end

    test 'iop metadata updates when IoP smart proxy is destroyed' do
      # Create an IoP smart proxy
      proxy = create_iop_proxy

      metadata = ::Foreman::Plugin.app_metadata_registry.all_plugin_metadata[:foreman_rh_cloud]
      assert metadata[:iop].call

      # Destroy the proxy
      proxy.destroy

      # Metadata should now return false
      refute metadata[:iop].call
    end
  end

  describe 'URL methods' do
    test 'base_url returns cloud URL when no IoP smart proxy exists' do
      assert_equal 'https://cloud.redhat.com', ForemanRhCloud.base_url
    end

    test 'cert_base_url returns cloud URL when no IoP smart proxy exists' do
      assert_equal 'https://cert.cloud.redhat.com', ForemanRhCloud.cert_base_url
    end

    test 'legacy_insights_url returns cloud URL when no IoP smart proxy exists' do
      assert_equal 'https://cert-api.access.redhat.com', ForemanRhCloud.legacy_insights_url
    end

    test 'base_url returns IoP URL when IoP smart proxy exists' do
      create_iop_proxy

      assert_equal 'https://iop.example.com', ForemanRhCloud.base_url
    end

    test 'cert_base_url returns IoP URL when IoP smart proxy exists' do
      create_iop_proxy

      assert_equal 'https://iop.example.com', ForemanRhCloud.cert_base_url
    end

    test 'legacy_insights_url returns IoP URL when IoP smart proxy exists' do
      create_iop_proxy

      assert_equal 'https://iop.example.com', ForemanRhCloud.legacy_insights_url
    end

    test 'base_url returns ENV var when set' do
      ENV['SATELLITE_RH_CLOUD_URL'] = 'https://custom.example.com'

      assert_equal 'https://custom.example.com', ForemanRhCloud.base_url
    ensure
      ENV.delete('SATELLITE_RH_CLOUD_URL')
    end

    test 'cert_base_url returns ENV var when set' do
      ENV['SATELLITE_CERT_RH_CLOUD_URL'] = 'https://env-cert.cloud.test'

      assert_equal 'https://env-cert.cloud.test', ForemanRhCloud.cert_base_url
    ensure
      ENV.delete('SATELLITE_CERT_RH_CLOUD_URL')
    end

    test 'legacy_insights_url returns ENV var when set' do
      ENV['SATELLITE_LEGACY_INSIGHTS_URL'] = 'https://env-legacy.insights.test'

      assert_equal 'https://env-legacy.insights.test', ForemanRhCloud.legacy_insights_url
    ensure
      ENV.delete('SATELLITE_LEGACY_INSIGHTS_URL')
    end

    test 'base_url prefers IoP URL over ENV var' do
      ENV['SATELLITE_RH_CLOUD_URL'] = 'https://custom.example.com'

      create_iop_proxy

      # IoP URL should take precedence
      assert_equal 'https://iop.example.com', ForemanRhCloud.base_url
    ensure
      ENV.delete('SATELLITE_RH_CLOUD_URL')
    end

    test 'cert_base_url prefers IoP URL over ENV var' do
      ENV['SATELLITE_CERT_RH_CLOUD_URL'] = 'https://env-cert.cloud.test'

      create_iop_proxy

      # IoP URL should take precedence
      assert_equal 'https://iop.example.com', ForemanRhCloud.cert_base_url
    ensure
      ENV.delete('SATELLITE_CERT_RH_CLOUD_URL')
    end

    test 'legacy_insights_url prefers IoP URL over ENV var' do
      ENV['SATELLITE_LEGACY_INSIGHTS_URL'] = 'https://env-legacy.insights.test'

      create_iop_proxy

      # IoP URL should take precedence
      assert_equal 'https://iop.example.com', ForemanRhCloud.legacy_insights_url
    ensure
      ENV.delete('SATELLITE_LEGACY_INSIGHTS_URL')
    end

    test 'URL methods update when IoP smart proxy is created' do
      # Initially returns cloud URLs
      assert_equal 'https://cloud.redhat.com', ForemanRhCloud.base_url
      assert_equal 'https://cert.cloud.redhat.com', ForemanRhCloud.cert_base_url
      assert_equal 'https://cert-api.access.redhat.com', ForemanRhCloud.legacy_insights_url

      # Create an IoP smart proxy
      create_iop_proxy

      # Should now return IoP URL for all helpers
      assert_equal 'https://iop.example.com', ForemanRhCloud.base_url
      assert_equal 'https://iop.example.com', ForemanRhCloud.cert_base_url
      assert_equal 'https://iop.example.com', ForemanRhCloud.legacy_insights_url
    end

    test 'URL methods update when IoP smart proxy is destroyed' do
      # Create an IoP smart proxy
      proxy = create_iop_proxy

      # Initially returns IoP URL for all helpers
      assert_equal 'https://iop.example.com', ForemanRhCloud.base_url
      assert_equal 'https://iop.example.com', ForemanRhCloud.cert_base_url
      assert_equal 'https://iop.example.com', ForemanRhCloud.legacy_insights_url

      # Destroy the proxy
      proxy.destroy

      # Should now return cloud URLs again
      assert_equal 'https://cloud.redhat.com', ForemanRhCloud.base_url
      assert_equal 'https://cert.cloud.redhat.com', ForemanRhCloud.cert_base_url
      assert_equal 'https://cert-api.access.redhat.com', ForemanRhCloud.legacy_insights_url
    end
  end
end
