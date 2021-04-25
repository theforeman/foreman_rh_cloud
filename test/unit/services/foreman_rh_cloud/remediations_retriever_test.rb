require 'test_plugin_helper'

class RemediationsRetrieverTest < ActiveSupport::TestCase
  setup do
    @host1 = FactoryBot.create(:host)
    @host2 = FactoryBot.create(:host)
  end
  test 'groups hosts together' do
    rule1 = FactoryBot.create(:insights_rule)
    rule1_remediation1 = FactoryBot.create(:insights_resolution, rule_id: rule1.rule_id, resolution_type: 'fix')

    FactoryBot.create(:insights_facet, uuid: 'HOST1', host_id: @host1.id)
    host1_hit1 = FactoryBot.create(:insights_hit, rule_id: rule1.rule_id, host_id: @host1.id)

    FactoryBot.create(:insights_facet, uuid: 'HOST2', host_id: @host2.id)
    host2_hit1 = FactoryBot.create(:insights_hit, rule_id: rule1.rule_id, host_id: @host2.id)

    pairs = [{'hit_id' => host1_hit1.id, 'resolution_id' => rule1_remediation1.id}, {'hit_id' => host2_hit1.id, 'resolution_id' => rule1_remediation1.id}]
    retriever = ForemanRhCloud::RemediationsRetriever.new(pairs)

    actual_request = retriever.send(:playbook_request)

    assert_not_nil (issues = actual_request[:issues])
    assert_not_nil (resolution = issues.first)
    assert_equal 'fix', resolution[:resolution]
    assert_equal "advisor:#{rule1.rule_id}", resolution[:id]
    assert_same_elements ['HOST1', 'HOST2'], resolution[:systems]
  end

  test 'does not group different resolutions' do
    rule1 = FactoryBot.create(:insights_rule)
    rule1_remediation1 = FactoryBot.create(:insights_resolution, rule_id: rule1.rule_id, resolution_type: 'fix')
    rule1_remediation2 = FactoryBot.create(:insights_resolution, rule_id: rule1.rule_id, resolution_type: 'panic')

    FactoryBot.create(:insights_facet, uuid: 'HOST1', host_id: @host1.id)
    host1_hit1 = FactoryBot.create(:insights_hit, rule_id: rule1.rule_id, host_id: @host1.id)

    FactoryBot.create(:insights_facet, uuid: 'HOST2', host_id: @host2.id)
    host2_hit1 = FactoryBot.create(:insights_hit, rule_id: rule1.rule_id, host_id: @host2.id)

    pairs = [{'hit_id' => host1_hit1.id, 'resolution_id' => rule1_remediation1.id}, {'hit_id' => host2_hit1.id, 'resolution_id' => rule1_remediation2.id}]
    retriever = ForemanRhCloud::RemediationsRetriever.new(pairs)

    actual_request = retriever.send(:playbook_request)

    assert_not_nil (issues = actual_request[:issues])
    assert_equal 2, issues.count
  end
end
