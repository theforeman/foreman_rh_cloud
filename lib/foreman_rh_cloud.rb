require 'foreman_rh_cloud/engine.rb'

module ForemanRhCloud
  def self.base_url
    # for testing set ENV to 'https://ci.cloud.redhat.com'
    @base_url ||= ENV['SATELLITE_RH_CLOUD_URL'] || 'https://cloud.redhat.com'
  end

  def self.authentication_url
    # https://sso.redhat.com/auth/realms/redhat-external/protocol/openid-connect/token
    @authentication_url ||= ENV['SATELLITE_RH_CLOUD_SSO_URL'] || 'https://sso.redhat.com/auth/realms/redhat-external/protocol/openid-connect/token'
  end

  def self.verify_ssl_method
    @verify_ssl_method ||= ENV['SATELLITE_RH_CLOUD_URL'] ? OpenSSL::SSL::VERIFY_NONE : OpenSSL::SSL::VERIFY_PEER
  end
end
