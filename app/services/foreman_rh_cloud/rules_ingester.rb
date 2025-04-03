module ForemanRhCloud
  class RulesIngester
    def ingest_rules_and_resolutions!
      rules, resolutions = fetch_rules_and_resolutions
      # rubocop:disable Rails/SkipsModelValidations
      ::InsightsRule.upsert_all(rules, unique_by: :rule_id)
      ::InsightsResolution.delete_all
      ::InsightsResolution.insert_all(resolutions)
      # rubocop:enable Rails/SkipsModelValidations
    end

    private

    def fetch_rules_data
      advisor_url = "#{ForemanRhCloud.on_premise_url}/r/insights/v1/static/release/content.json"
      uri = URI.parse(advisor_url)
      http = Net::HTTP.new(uri.host, uri.port)
      http.use_ssl = true

      # Set CA certificate
      http.ca_file = ForemanRhCloud.ca_cert
      http.verify_mode = OpenSSL::SSL::VERIFY_PEER

      request = Net::HTTP::Get.new(uri.request_uri)

      response = http.request(request)
      JSON.parse(response.body, symbolize_names: true)
    end

    def fetch_rules_and_resolutions
      rules = fetch_rules_data.values.map do |rule|
        next unless rule[:active]
        next if rule[:playbooks].blank?
        rule.slice(:description, :category,
          :impact_name, :summary, :generic, :reason,
          :rec_likelihood, :rec_impact, :reboot_required,
          :more_info, :rule_id, :playbooks)
      end
      rules.compact!

      resolutions = rules.flat_map do |rule|
        rule[:playbooks].map do |fix_type, playbook|
          {
            rule_id: rule[:rule_id],
            description: playbook[:name],
            needs_reboot: playbook[:reboot_required] == true,
            resolution_risk: rule[:resolution_risk],
            resolution_type: fix_type,
          }
        end
      end

      rules.map! do |rule|
        {
          rule_id: rule[:rule_id],
          description: rule[:description],
          category_name: rule[:category],
          impact_name: rule[:impact_name],
          summary: rule[:summary],
          generic: rule[:generic],
          reason: rule[:reason],
          total_risk: ((rule[:rec_likelihood] + rule[:rec_impact]) / 2).to_i,
          reboot_required: rule[:reboot_required] == true,
          more_info: rule[:more_info],
          rating: 0,
        }
      end

      [rules, resolutions]
    end
  end
end
