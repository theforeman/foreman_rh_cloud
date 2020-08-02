module InsightsCloud
  module WebUi
    ADVISOR = 'advisor'
    VULNERABILITY = 'vulnerability'
    PATCH = 'patch'

    def self.system_url(subsystem, host_uuid)
      InsightsCloud.base_url + "/insights/#{subsystem}/systems/#{host_uuid}"
    end
  end
  def self.base_url
    # for testing set ENV to 'https://ci.cloud.redhat.com'
    @base_url ||= ENV['SATELLITE_INSIGHTS_CLOUD_URL'] || 'https://cloud.redhat.com'
  end

  def self.authentication_url
    # https://sso.redhat.com/auth/realms/redhat-external/protocol/openid-connect/token
    @authentication_url ||= ENV['SATELLITE_INSIGHTS_CLOUD_SSO_URL'] || 'https://sso.redhat.com/auth/realms/redhat-external/protocol/openid-connect/token'
  end

  def self.hits_export_url
    base_url + '/api/insights/v1/export/hits/'
  end
end
