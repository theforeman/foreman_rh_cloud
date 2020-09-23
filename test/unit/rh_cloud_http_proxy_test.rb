require 'test_plugin_helper'

class RhCloudHttpProxyTest < ActiveSupport::TestCase
  setup do
    @global_content_proxy_mock = 'http://global:content@localhost:8888'
    @global_foreman_proxy_mock = 'http://global:foreman@localhost:8888'
    @katello_cdn_proxy_mock = {
      host: 'localhost',
      port: '8888',
      user: 'katello',
      password: 'cdn',
      scheme: 'http',
    }
    @katello_cdn_proxy_string_mock = 'http://katello:cdn@localhost:8888'
  end

  test 'selects global content proxy' do
    setup_global_content_proxy
    setup_global_foreman_proxy
    setup_cdn_proxy do
      assert_equal @global_content_proxy_mock, ForemanRhCloud.proxy_setting
    end
  end

  test 'selects cdn proxy' do
    setup_global_foreman_proxy
    setup_cdn_proxy do
      assert_equal @katello_cdn_proxy_string_mock, ForemanRhCloud.proxy_setting
    end
  end

  test 'selects global foreman proxy' do
    setup_global_foreman_proxy

    assert_equal @global_foreman_proxy_mock, ForemanRhCloud.proxy_setting
  end

  def setup_global_content_proxy
    http_proxy = FactoryBot.create(:http_proxy, url: @global_content_proxy_mock)
    HttpProxy.stubs(:default_global_content_proxy).returns(http_proxy)
  end

  def setup_global_foreman_proxy
    FactoryBot.create(:setting, :name => 'http_proxy', :value => @global_foreman_proxy_mock)
  end

  def setup_cdn_proxy
    old_cdn_setting = SETTINGS[:katello][:cdn_proxy]
    SETTINGS[:katello][:cdn_proxy] = @katello_cdn_proxy_mock
    yield
  ensure
    SETTINGS[:katello][:cdn_proxy] = old_cdn_setting
  end

  test 'transform proxy scheme test' do
    mock_http_proxy = 'http://user:password@localhost:8888'
    mock_https_proxy = 'https://user:password@localhost:8888'

    transformed_http_uri = URI.parse(ForemanRhCloud.transform_scheme(mock_http_proxy))
    transformed_https_uri = URI.parse(ForemanRhCloud.transform_scheme(mock_https_proxy))

    assert_equal 'proxy', transformed_http_uri.scheme
    assert_equal 'proxys', transformed_https_uri.scheme
  end
end
