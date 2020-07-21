module InventorySync
  def self.base_url
    # for testing set ENV to 'https://ci.cloud.redhat.com'
    @base_url ||= ENV['SATELLITE_INVENTORY_CLOUD_URL'] || 'https://cloud.redhat.com'
  end

  def self.authentication_url
    # https://sso.redhat.com/auth/realms/redhat-external/protocol/openid-connect/token
    @authentication_url ||= ENV['SATELLITE_INVENTORY_CLOUD_SSO_URL'] || 'https://sso.redhat.com/auth/realms/redhat-external/protocol/openid-connect/token'
  end

  def self.inventory_export_url
    base_url + '/api/inventory/v1/hosts'
  end
end
