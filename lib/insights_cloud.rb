module InsightsCloud
  module WebUi
    ADVISOR = 'advisor'
    VULNERABILITY = 'vulnerability'
    PATCH = 'patch'

    def self.system_url(subsystem, host_uuid)
      ForemanRhCloud.base_url + "/insights/#{subsystem}/systems/#{host_uuid}"
    end
  end

  def self.hits_export_url
    ForemanRhCloud.base_url + '/api/insights/v1/export/hits/'
  end
end
