require 'test_plugin_helper'

class HitsUploaderTest < ActiveSupport::TestCase
  PAYLOAD = {
    resolutions: [
      {
        rule_id: "R123",
        description: "Apply security patch to fix vulnerability CVE-2025-0001.",
        needs_reboot: true,
        resolution_risk: "Medium",
        resolution_type: "fix",
      },
      {
        rule_id: "R124",
        description: "Update configuration file to improve system stability.",
        needs_reboot: false,
        resolution_risk: "Low",
        resolution_type: "fix",
      },
    ],
    rules: [
      {
        rule_id: "R123",
        description: "Security patch for CVE-2025-0001.",
        category_name: "Security",
        impact_name: "High",
        summary: "Fixes critical vulnerability.",
        generic: "Security updates are mandatory.",
        reason: "Vulnerability exposed in external audit.",
        total_risk: 5,
        reboot_required: true,
        more_info: "https://example.com/security-update",
        rating: 4.8,
      },
      {
        rule_id: "R124",
        description: "Configuration update to improve performance.",
        category_name: "Availability",
        impact_name: "Medium",
        summary: "Improves application stability and reduces crashes.",
        generic: "Periodic updates recommended.",
        reason: "Frequent crashes observed in logs.",
        total_risk: 3,
        reboot_required: false,
        more_info: "https://example.com/config-update",
        rating: 4.0,
      },
    ],
    hits: [
      {
        rule_id: "R123",
        title: "Critical Vulnerability Patch",
        solution_url: "https://example.com/solution",
        total_risk: 5,
        likelihood: 4,
        publish_date: "2025-01-01",
        results_url: "https://example.com/results",
      },
      {
        rule_id: "R124",
        title: "Configuration Update",
        solution_url: "https://example.com/config-solution",
        total_risk: 3,
        likelihood: 3,
        publish_date: "2025-01-02",
        results_url: "https://example.com/config-results",
      },
    ],
    details: "{\"summary\": \"Detected issues and resolutions applied successfully.\"}",
  }.freeze

  setup do
    @host = FactoryBot.create(:host)
    @uuid = SecureRandom.uuid
    rules_resolutions = [PAYLOAD[:rules], PAYLOAD[:resolutions]]
    ForemanRhCloud::RulesIngester.any_instance.
      expects(:fetch_rules_and_resolutions).returns(rules_resolutions)
    @uploader = ForemanRhCloud::HitsUploader.new(host: @host, payload: PAYLOAD, uuid: @uuid)
    @uploader.upload!
    @host.reload
  end

  test 'facets' do
    assert_equal @uuid, @host.insights_facet.uuid
  end

  test 'hits' do
    assert_equal PAYLOAD[:hits].count, @host.insights_facet.hits_count
    assert_includes @host.insights_facet.hits.pluck(:rule_id), "R124"
  end

  test 'assert reupload does not trigger rules download' do
    # rules must already be in the database so dont retrigger
    # rules download.
    ForemanRhCloud::RulesIngester.any_instance.
      expects(:ingest_rules_and_resolutions!).never
    @uploader.upload!
  end

  test "resolutions" do
    assert_equal 2, InsightsResolution.where(rule_id: ["R123", "R124"]).count
  end

  test "details" do
    fact_name = FactName.where(name: "insights::hit_details").first
    fact_value = @host.fact_values.where(fact_name: fact_name).first
    refute_nil fact_value
    assert_equal PAYLOAD[:details], fact_value.value
  end

  test "empty payload" do
    payload = {
      resolutions: [],
      rules: [],
      hits: [],
      details: "",
    }

    @host = FactoryBot.create(:host)
    @uuid = SecureRandom.uuid
    uploader = ForemanRhCloud::HitsUploader.new(host: @host, payload: payload, uuid: @uuid)
    uploader.upload!
    @host.reload
    assert_equal @uuid, @host.insights_facet.uuid
    assert_empty @host.insights_facet.hits
    assert_equal 0, @host.insights_facet.hits_count
    fact_name = FactName.where(name: "insights::hit_details").first
    fact_value = @host.fact_values.where(fact_name: fact_name).first
    assert_nil fact_value
  end
end
