require 'foreman_rh_cloud/engine.rb'
require 'cgi'
require 'uri'

module ForemanRhCloud
  def self.base_url
    # for testing set ENV to 'https://ci.cloud.redhat.com'
    @base_url ||= ENV['SATELLITE_RH_CLOUD_URL'] || 'https://cloud.redhat.com'
  end

  def self.cert_base_url
    @cert_base_url ||= ENV['SATELLITE_CERT_RH_CLOUD_URL'] || 'https://cert.cloud.redhat.com'
  end

  def self.authentication_url
    # https://sso.redhat.com/auth/realms/redhat-external/protocol/openid-connect/token
    @authentication_url ||= ENV['SATELLITE_RH_CLOUD_SSO_URL'] || 'https://sso.redhat.com/auth/realms/redhat-external/protocol/openid-connect/token'
  end

  def self.verify_ssl_method
    @verify_ssl_method ||= ENV['SATELLITE_RH_CLOUD_URL'] ? OpenSSL::SSL::VERIFY_NONE : OpenSSL::SSL::VERIFY_PEER
  end

  def self.query_limit
    @query_limit ||= ENV['SATELLITE_RH_CLOUD_QUERY_LIMIT'] ? ENV['SATELLITE_RH_CLOUD_QUERY_LIMIT'].to_i : 100
  end

  def self.http_proxy_string(logger: Foreman::Logging.logger('background'))
    ForemanRhCloud.proxy_setting(logger: logger)
  end

  def self.transformed_http_proxy_string(logger: Foreman::Logging.logger('background'))
    ForemanRhCloud.transform_scheme(ForemanRhCloud.proxy_setting(logger: logger))
  end

  def self.proxy_setting(logger: Foreman::Logging.logger('background'))
    HttpProxy.default_global_content_proxy&.full_url ||
    ForemanRhCloud.cdn_proxy(logger: logger) ||
    ForemanRhCloud.global_foreman_proxy ||
    ''
  end

  def self.cdn_proxy(logger: Foreman::Logging.logger('app'))
    proxy_config = SETTINGS[:katello][:cdn_proxy]
    return nil unless proxy_config

    uri = URI('')
    uri.host = proxy_config[:host]
    uri.port = proxy_config[:port]
    uri.scheme = proxy_config[:scheme] || 'http'

    if proxy_config[:user]
      uri.user = CGI.escape(proxy_config[:user])
      uri.password = CGI.escape(proxy_config[:password])
    end
    uri.to_s
  rescue URI::Error => e
    logger.warn("cdn_proxy parsing failed: #{e}")
    nil
  end

  def self.global_foreman_proxy
    Setting[:http_proxy]
  end

  # This method assumes uri_string contains uri-encoded username and p@$$word:
  # http://user:p%40%24%24word@localhost:8888
  def self.transform_scheme(uri_string)
    return unless uri_string
    transformed_uri = URI.parse(uri_string)

    case transformed_uri.scheme
    when "http"
      transformed_uri.scheme = 'proxy'
    when "https"
      transformed_uri.scheme = 'proxys'
    end

    transformed_uri.to_s
  end
end
