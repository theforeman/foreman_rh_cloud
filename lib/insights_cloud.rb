module InsightsCloud
  def self.base_url
    # for testing set ENV to 'https://ci.cloud.redhat.com'
    @base_url ||= ENV['SATELLITE_INSIGHTS_CLOUD_URL'] || 'https://cert.cloud.redhat.com'
  end

  def self.hits_export_url
    base_url + '/api/insights/v1/export/hits/'
  end
end
