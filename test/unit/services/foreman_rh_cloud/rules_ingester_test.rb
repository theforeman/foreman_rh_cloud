require 'test_plugin_helper'

class RulesIngesterTest < ActiveSupport::TestCase
  PAYLOAD = {
    non_active: {
      rule_id: "non_active",
      active: false,
    },
    no_playbooks: {
      rule_id: "no_playbooks",
      active: true,
      playbooks: {},
    },
    R123: {
      active: true,
      rule_id: "R123",
      description: "R123 failed.",
      category: "Stability",
      reboot_required: false,
      impact_name: "R123 Failure",
      rec_impact: 1,
      rec_likelihood: 1,
      playbooks: {
        resolution1: {
          name: "Update package to 100.9 or above",
          reboot_required: false,
        },
        resolution2: {
          name: "Update other package to 101.9 or above",
          reboot_required: true,
          text: "- name: Update package-102",
        },
      },
    },
  }.freeze

  setup do
    ForemanRhCloud::RulesIngester.any_instance.expects(:fetch_rules_data).returns(PAYLOAD)
    ForemanRhCloud::RulesIngester.new.ingest_rules_and_resolutions!
  end

  test 'non active are ignored' do
    refute InsightsRule.where(rule_id: "non_active").exists?
  end

  test 'non playbooks are ignored' do
    refute InsightsRule.where(rule_id: "no_playbooks").exists?
  end

  test 'R123 exists' do
    rule = InsightsRule.find_by(rule_id: "R123")
    refute_nil rule
    assert_equal "R123 Failure", rule.impact_name
  end

  test 'Resolutions exists' do
    assert_equal 2, InsightsResolution.where(rule_id: "R123").count
    assert InsightsResolution.where(rule_id: "R123", resolution_type: "resolution1").exists?
  end
end
