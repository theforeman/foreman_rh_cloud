require 'test_plugin_helper'

class TemplateRendererHelperTest < ActiveSupport::TestCase
  include ForemanRhCloud::TemplateRendererHelper
  include MockCerts

  setup do
    response = mock('respone')
    response.stubs(:body).returns('TEST PLAYBOOK')
    ForemanRhCloud::RemediationsRetriever.any_instance.stubs(:query_playbook).returns(response)
    @host1 = FactoryBot.create(:host)

    setup_certs_expectation do
      ForemanRhCloud::RemediationsRetriever.any_instance.stubs(:candlepin_id_cert)
    end
  end

  test 'Generates a playbook for hit and remediation' do
    rule = FactoryBot.create(:insights_rule)
    hit = FactoryBot.create(:insights_hit, rule: rule, host_id: @host1.id)
    remediation = FactoryBot.create(:insights_resolution, rule: rule)

    pairs = [{hit_id: hit.id, remediation_id: remediation.id}].to_json

    actual_playbook = remediations_playbook(pairs)

    assert_equal 'TEST PLAYBOOK', actual_playbook
  end

  def template_logger
    Logger.new(IO::NULL)
  end
end
