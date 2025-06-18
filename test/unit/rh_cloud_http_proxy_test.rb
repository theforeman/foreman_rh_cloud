require 'test_plugin_helper'

class RhCloudHttpProxyTest < ActiveSupport::TestCase
  setup do
    @global_content_proxy_mock = 'http://global:content@localhost:80'
    @global_foreman_proxy_mock = 'http://global:foreman@localhost:80'
    ForemanRhCloud.stubs(:with_local_advisor_engine?).returns(false)
  end

  test 'selects global content proxy' do
    setup_global_content_proxy
    setup_global_foreman_proxy
    assert_equal @global_content_proxy_mock, ForemanRhCloud.proxy_setting
  end

  test 'selects global foreman proxy' do
    setup_global_foreman_proxy

    assert_equal @global_foreman_proxy_mock, ForemanRhCloud.proxy_setting
  end

  test 'returns empty string in on-prem setup' do
    ForemanRhCloud.unstub(:with_local_advisor_engine?)
    ForemanRhCloud.stubs(:with_local_advisor_engine?).returns(true)

    assert_empty ForemanRhCloud.proxy_setting
  end

  def setup_global_content_proxy
    http_proxy = FactoryBot.create(:http_proxy, url: @global_content_proxy_mock)
    HttpProxy.stubs(:default_global_content_proxy).returns(http_proxy)
  end

  def setup_global_foreman_proxy
    Setting[:http_proxy] = @global_foreman_proxy_mock
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
