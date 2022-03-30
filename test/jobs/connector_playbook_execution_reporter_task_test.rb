require 'json'
require 'test_plugin_helper'
require 'foreman_tasks/test_helpers'
require "#{ForemanTasks::Engine.root}/test/support/dummy_dynflow_action"

class ConnectorPlaybookExecutionReporterTaskTest < ActiveSupport::TestCase
  include ForemanTasks::TestHelpers::WithInThreadExecutor

  # override default send behavior for the test
  class TestConnectorPlaybookExecutionReporterTask < InsightsCloud::Async::ConnectorPlaybookExecutionReporterTask
    def send_report(report)
      output[:saved_reports] = (output[:saved_reports] || []) << report
    end
  end

  setup do
    RemoteExecutionFeature.register(
      :rh_cloud_connector_run_playbook,
      N_('Run RH Cloud playbook'),
      description: N_('Run playbook genrated by Red Hat remediations app'),
      host_action_button: false,
      provided_inputs: ['playbook_url', 'report_url', 'correlation_id', 'report_interval']
    )

    @job_invocation = generate_job_invocation
  end

  test 'It reports finish playbook messages' do
    TestConnectorPlaybookExecutionReporterTask.any_instance.stubs(:done?).returns(true)
    TestConnectorPlaybookExecutionReporterTask.any_instance.stubs(:connector_playbook_job?).returns(true)

    actual = ForemanTasks.sync_task(TestConnectorPlaybookExecutionReporterTask, @job_invocation)

    wait_for_task(actual)

    actual_report = actual.output[:saved_reports].first.to_s

    assert_equal 1, actual.output[:saved_reports].size
    assert_not_nil actual_report
    actual_jsonl = read_jsonl(actual_report)

    assert_not_nil actual_report_finished = actual_jsonl.find { |l| l['type'] == 'playbook_run_completed' }
    assert_equal 'TEST_CORRELATION', actual_report_finished['correlation_id']
    assert_equal 'success', actual_report_finished['status']

    assert_not_nil actual_host_finished = actual_jsonl.find { |l| l['type'] == 'playbook_run_finished' && l['host'] == @host1.insights.uuid }
    assert_equal 'TEST_CORRELATION', actual_host_finished['correlation_id']
    assert_equal 'success', actual_host_finished['status']
  end

  test 'It reports single progress message for done host' do
    TestConnectorPlaybookExecutionReporterTask.any_instance.stubs(:done?).returns(false, true)
    TestConnectorPlaybookExecutionReporterTask.any_instance.stubs(:connector_playbook_job?).returns(true)

    actual = ForemanTasks.sync_task(TestConnectorPlaybookExecutionReporterTask, @job_invocation)

    wait_for_task(actual)

    actual_report = actual.output[:saved_reports].first.to_s

    assert_equal 1, actual.output[:saved_reports].size
    assert_not_nil actual_report
    actual_jsonl = read_jsonl(actual_report)

    actual_host_updates = actual_jsonl
      .select { |l| l['type'] == 'playbook_run_update' && l['host'] == @host1.insights.uuid }
    assert_equal 1, actual_host_updates.size
    assert_equal 0, actual_host_updates.first['sequence']
  end

  test 'It reports two progress messages for in progress host' do
    TestConnectorPlaybookExecutionReporterTask.any_instance.stubs(:done?).returns(false, false, true)
    TestConnectorPlaybookExecutionReporterTask.any_instance.stubs(:connector_playbook_job?).returns(true)

    host1_task = @job_invocation.template_invocations.joins(:host).where(hosts: {name: @host1.name}).first.run_host_job_task
    host1_task.state = 'running'
    host1_task.save!

    actual = ForemanTasks.sync_task(TestConnectorPlaybookExecutionReporterTask, @job_invocation)

    wait_for_task(actual)

    assert_equal 2, actual.output[:saved_reports].size

    first_report = actual.output[:saved_reports].first.to_s
    actual_jsonl = read_jsonl(first_report)

    actual_host_updates = actual_jsonl
      .select { |l| l['type'] == 'playbook_run_update' && l['host'] == @host1.insights.uuid }
    assert_equal 1, actual_host_updates.size
    assert_equal 0, actual_host_updates.first['sequence']

    actual_host_updates = actual_jsonl
      .select { |l| l['type'] == 'playbook_run_update' && l['host'] == @host2.insights.uuid }
    assert_equal 1, actual_host_updates.size
    assert_equal 0, actual_host_updates.first['sequence']

    second_report = actual.output[:saved_reports].last.to_s
    actual_jsonl = read_jsonl(second_report)

    actual_host_updates = actual_jsonl
      .select { |l| l['type'] == 'playbook_run_update' && l['host'] == @host1.insights.uuid }
    assert_equal 1, actual_host_updates.size
    assert_equal 1, actual_host_updates.first['sequence']

    actual_host_updates = actual_jsonl
      .select { |l| l['type'] == 'playbook_run_update' && l['host'] == @host2.insights.uuid }
    assert_equal 0, actual_host_updates.size
  end

  private

  def generate_job_invocation
    job_template = FactoryBot.build(
      :job_template,
      :template => 'BLEH'
    )
    job_invocation = FactoryBot.create(
      :job_invocation,
      remote_execution_feature_id: RemoteExecutionFeature.feature!(:rh_cloud_connector_run_playbook).id,
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

  def wait_for_task(task)
    sleep(2) while task.reload.state != 'stopped'
  end
end
