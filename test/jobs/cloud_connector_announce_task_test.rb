require 'json'
require 'test_plugin_helper'
require 'foreman_tasks/test_helpers'
require "#{ForemanTasks::Engine.root}/test/support/dummy_dynflow_action"

class CloudConnectorAnnounceTaskTest < ActiveSupport::TestCase
  include ForemanTasks::TestHelpers::WithInThreadExecutor

  setup do
    feature = RemoteExecutionFeature.register(
      :ansible_configure_cloud_connector,
      N_('Configure Cloud Connector on given hosts'),
      :description => N_('Configure Cloud Connector on given hosts'),
      :proxy_selector_override => ::RemoteExecutionProxySelector::INTERNAL_PROXY
    )

    @job_invocation = generate_job_invocation(:ansible_configure_cloud_connector)

    # reset connector feature ID cache
    InsightsCloud::Async::CloudConnectorAnnounceTask.instance_variable_set(:@connector_feature_id, nil)
  end

  test 'It executes cloud presence announcer' do
    ForemanRhCloud::CloudPresence.any_instance.expects(:announce_to_sources).times(Organization.unscoped.count)

    actual = ForemanTasks.sync_task(InsightsCloud::Async::CloudConnectorAnnounceTask, @job_invocation)
  end

  private

  def generate_job_invocation(feature_name)
    job_template = FactoryBot.build(
      :job_template,
      :template => 'BLEH'
    )
    feature = RemoteExecutionFeature.feature!(feature_name).id

    job_invocation = FactoryBot.create(
      :job_invocation,
      remote_execution_feature_id: feature,
      task_id: FactoryBot.create(:dynflow_task).id
    )

    job_template.template_inputs << playbook_url_input = FactoryBot.build(:template_input,
      :name => 'playbook_url',
      :input_type => 'user',
      :required => true)
    job_template.template_inputs << report_url_input = FactoryBot.build(:template_input,
      :name => 'report_url',
      :input_type => 'user',
      :required => true)
    job_template.template_inputs << correlation_id_input = FactoryBot.build(:template_input,
      :name => 'correlation_id',
      :input_type => 'user',
      :required => true)
    job_template.template_inputs << report_interval_input = FactoryBot.build(:template_input,
      :name => 'report_interval',
      :input_type => 'user',
      :required => true)

    template_invocation = FactoryBot.build(:template_invocation,
      :template => job_template,
      :job_invocation => job_invocation
    )

    template_invocation.input_values << FactoryBot.create(
      :template_invocation_input_value,
      :template_invocation => template_invocation,
      :template_input => playbook_url_input,
      :value => 'http://example.com/TEST_PLAYBOOK'
    )
    template_invocation.input_values << FactoryBot.create(
      :template_invocation_input_value,
      :template_invocation => template_invocation,
      :template_input => report_url_input,
      :value => 'http://example.com/TEST_REPORT'
    )
    template_invocation.input_values << FactoryBot.create(
      :template_invocation_input_value,
      :template_invocation => template_invocation,
      :template_input => correlation_id_input,
      :value => 'TEST_CORRELATION'
    )
    template_invocation.input_values << FactoryBot.create(
      :template_invocation_input_value,
      :template_invocation => template_invocation,
      :template_input => report_interval_input,
      :value => '1'
    )

    @host1 = FactoryBot.create(:host, :with_insights_hits, name: 'host1')
    @host1.insights.uuid = 'TEST_UUID1'
    @host1.insights.save!
    @host2 = FactoryBot.create(:host, :with_insights_hits, name: 'host2')
    @host2.insights.uuid = 'TEST_UUID2'
    @host2.insights.save!

    targeting = FactoryBot.create(:targeting, hosts: [@host1, @host2])
    job_invocation.targeting = targeting
    job_invocation.save!

    job_invocation.template_invocations << FactoryBot.create(
      :template_invocation,
      run_host_job_task: FactoryBot.create(:dynflow_task),
      host_id: @host1.id
    )
    job_invocation.template_invocations << FactoryBot.create(
      :template_invocation,
      run_host_job_task: FactoryBot.create(:dynflow_task),
      host_id: @host2.id
    )

    fake_output = (1..5).map do |i|
      { 'timestamp' => (Time.now - (5 - i)).to_f, 'output' => "#{i}\n" }
    end
    Support::DummyDynflowAction.any_instance.stubs(:live_output).returns(fake_output)
    Support::DummyDynflowAction.any_instance.stubs(:exit_status).returns(0)

    job_invocation
  end

  def read_jsonl(jsonl)
    jsonl.lines.map { |l| JSON.parse(l) }
  end
end
