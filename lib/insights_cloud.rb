module InsightsCloud
  module WebUi
    ADVISOR = 'advisor'
    VULNERABILITY = 'vulnerability'
    PATCH = 'patch'
  end

  def self.hits_export_url
    ForemanRhCloud.cert_base_url + '/api/insights/v1/export/hits/'
  end

  def self.rules_url(limit: ForemanRhCloud.query_limit, offset: 0)
    ForemanRhCloud.cert_base_url + "/api/insights/v1/rule/?impacting=true&rule_status=enabled&has_playbook=true&limit=#{limit}&offset=#{offset}"
  end

  def self.resolutions_url
    ForemanRhCloud.cert_base_url + '/api/remediations/v1/resolutions'
  end

  def self.playbook_url
    ForemanRhCloud.cert_base_url + '/api/remediations/v1/playbook'
  end

  def self.remediation_rule_id(rule_id)
    "advisor:#{rule_id}"
  end

  def self.enable_client_param
    'host_registration_insights'
  end
end
