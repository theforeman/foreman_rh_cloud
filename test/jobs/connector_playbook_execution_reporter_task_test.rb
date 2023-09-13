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

    # reset connector feature ID cache
    TestConnectorPlaybookExecutionReporterTask.instance_variable_set(:@connector_feature_id, nil)
  end

  test 'It reports finish playbook messages' do
    host1_task = @job_invocation.sub_task_for_host(Host.where(name: 'host1').first)
    host1_task.state = 'stopped'
    host1_task.save!

    TestConnectorPlaybookExecutionReporterTask.any_instance.stubs(:job_finished?).returns(true)

    actual = ForemanTasks.sync_task(TestConnectorPlaybookExecutionReporterTask, @job_invocation)

    actual_report = actual.output[:saved_reports].first.to_s

    assert_equal 1, actual.output[:saved_reports].size
    assert_not_nil actual_report
    actual_jsonl = read_jsonl(actual_report)

    assert_equal true, actual.output['task']['invocation_status']['task_state']['task_done_reported']
    assert_equal 0, actual.output['task']['invocation_status']['hosts_state']['TEST_UUID1']['exit_status']
    assert_equal 0, actual.output['task']['invocation_status']['hosts_state']['TEST_UUID2']['exit_status']

    assert_equal true, @job_invocation.finished?
    assert_equal 'stopped', @job_invocation.sub_task_for_host(Host.where(name: 'host1').first)['state']

    assert_not_nil actual_report_finished = actual_jsonl.find { |l| l['type'] == 'playbook_run_completed' }
    assert_equal 'TEST_CORRELATION', actual_report_finished['correlation_id']
    assert_equal 'success', actual_report_finished['status']

    assert_not_nil actual_host_finished = actual_jsonl.find { |l| l['type'] == 'playbook_run_finished' && l['host'] == @host1.insights.uuid }
    assert_equal 'TEST_CORRELATION', actual_host_finished['correlation_id']
    assert_equal 'success', actual_host_finished['status']
  end

  test 'It reports single progress message for done host' do
    class ArrangeTestHost < InsightsCloud::Async::ConnectorPlaybookExecutionReporterTask
      def send_report(report)
        host1_task = @job_invocation.sub_task_for_host(Host.where(name: 'host1').first)
        host1_task.state = 'stopped'
        host1_task.save!

        output[:saved_reports] = (output[:saved_reports] || []) << report
      end
    end

    ArrangeTestHost.instance_variable_set(:@connector_feature_id, nil)
    host1_task = @job_invocation.sub_task_for_host(Host.where(name: 'host1').first)
    host1_task.state = 'running'
    host1_task.save!

    ArrangeTestHost.any_instance.stubs(:job_finished?).returns(false, true)

    actual = ForemanTasks.sync_task(ArrangeTestHost, @job_invocation)

    actual_report1 = actual.output[:saved_reports].first.to_s
    actual_report2 = actual.output[:saved_reports].second.to_s

    assert_equal 2, actual.output[:saved_reports].size
    assert_not_nil actual_report1
    assert_not_nil actual_report2

    actual_json1 = read_jsonl(actual_report1)
    actual_json2 = read_jsonl(actual_report2)

    assert_equal true, actual.output['task']['invocation_status']['task_state']['task_done_reported']
    assert_equal 0, actual.output['task']['invocation_status']['hosts_state']['TEST_UUID1']['exit_status']

    assert_equal 'stopped', @job_invocation.sub_task_for_host(Host.where(name: 'host1').first)['state']

    assert_not_nil actual_report_updated = actual_json1.find { |l| l['type'] == 'playbook_run_update' && l['host'] == 'TEST_UUID1' }
    assert_equal 'TEST_CORRELATION', actual_report_updated['correlation_id']
    assert_equal 'TEST_UUID1', actual_report_updated['host']
    assert_equal 0, actual_report_updated['sequence']
    assert_equal 6, actual_report_updated.size

    assert_not_nil actual_report_updated = actual_json2.find { |l| l['type'] == 'playbook_run_update' && l['host'] == 'TEST_UUID1' }
    assert_equal 'TEST_CORRELATION', actual_report_updated['correlation_id']
    assert_equal 'TEST_UUID1', actual_report_updated['host']
    assert_equal 1, actual_report_updated['sequence']
    assert_equal 6, actual_report_updated.size

    assert_not_nil actual_host_finished = actual_json2.find { |l| l['type'] == 'playbook_run_finished' && l['host'] == 'TEST_UUID1' }
    assert_equal 'TEST_CORRELATION', actual_host_finished['correlation_id']
    assert_equal 'TEST_UUID1', actual_host_finished['host']
    assert_equal 'success', actual_host_finished['status']
    assert_equal 7, actual_host_finished.size

    assert_not_nil actual_report_finished = actual_json2.find { |l| l['type'] == 'playbook_run_completed' }
    assert_equal 'TEST_CORRELATION', actual_report_finished['correlation_id']
    assert_equal 'success', actual_report_finished['status']
    assert_equal 4, actual_report_finished.size
  end

  test 'It reports two progress messages for in progress host' do
    class ArrangeTestHostTwo < InsightsCloud::Async::ConnectorPlaybookExecutionReporterTask
      def send_report(report)
        iteration_number = output[:iteration_number].to_i

        if iteration_number == 1
          host1_task = job_invocation.sub_task_for_host(Host.where(name: 'host1').first)
          host1_task.state = 'stopped'
          host1_task.save!
        end

        output[:iteration_number] = iteration_number + 1
        output[:saved_reports] = (output[:saved_reports] || []) << report
      end
    end

    ArrangeTestHostTwo.instance_variable_set(:@connector_feature_id, nil)
    host1_task = @job_invocation.sub_task_for_host(Host.where(name: 'host1').first)
    host1_task.state = 'running'
    host1_task.save!

    ArrangeTestHostTwo.any_instance.stubs(:job_finished?).returns(false, false, true)

    actual = ForemanTasks.sync_task(ArrangeTestHostTwo, @job_invocation)

    actual_report1 = actual.output[:saved_reports].first.to_s
    actual_report2 = actual.output[:saved_reports].second.to_s
    actual_report3 = actual.output[:saved_reports].third.to_s

    assert_equal 3, actual.output[:saved_reports].size
    assert_not_nil actual_report1
    assert_not_nil actual_report2
    assert_not_nil actual_report3

    actual_json1 = read_jsonl(actual_report1)
    actual_json2 = read_jsonl(actual_report2)
    actual_json3 = read_jsonl(actual_report3)

    assert_equal true, actual.output['task']['invocation_status']['task_state']['task_done_reported']
    assert_equal 0, actual.output['task']['invocation_status']['hosts_state']['TEST_UUID1']['exit_status']

    assert_not_nil actual_report_updated = actual_json1.find { |l| l['type'] == 'playbook_run_update' && l['host'] == 'TEST_UUID1' }
    assert_equal 'TEST_CORRELATION', actual_report_updated['correlation_id']
    assert_equal 'TEST_UUID1', actual_report_updated['host']
    assert_equal 0, actual_report_updated['sequence']
    assert_equal 6, actual_report_updated.size

    assert_not_nil actual_report_updated = actual_json2.find { |l| l['type'] == 'playbook_run_update' && l['host'] == 'TEST_UUID1' }
    assert_equal 'TEST_CORRELATION', actual_report_updated['correlation_id']
    assert_equal 'TEST_UUID1', actual_report_updated['host']
    assert_equal 1, actual_report_updated['sequence']
    assert_equal 6, actual_report_updated.size

    assert_not_nil actual_host_finished = actual_json3.find { |l| l['type'] == 'playbook_run_finished' && l['host'] == 'TEST_UUID1' }
    assert_equal 'TEST_CORRELATION', actual_host_finished['correlation_id']
    assert_equal 'TEST_UUID1', actual_host_finished['host']
    assert_equal 'success', actual_host_finished['status']
    assert_equal 7, actual_host_finished.size

    assert_not_nil actual_report_finished = actual_json3.find { |l| l['type'] == 'playbook_run_completed' }
    assert_equal 'TEST_CORRELATION', actual_report_finished['correlation_id']
    assert_equal 'success', actual_report_finished['status']
    assert_equal 4, actual_report_finished.size
  end

  private

  def generate_job_invocation
    job_template = FactoryBot.build(
      :job_template,
      :template => 'BLEH'
    )
    feature = RemoteExecutionFeature.feature!(:rh_cloud_connector_run_playbook).id

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

    @host1 = FactoryBot.create(:host, :with_insights_hits)
    @host1.name = 'host1' # overriding name since there is an issue with Factorybot and setting the name correctly, same for 2nd host
    @host1.insights.uuid = 'TEST_UUID1'
    @host1.insights.save!
    @host2 = FactoryBot.create(:host, :with_insights_hits)
    @host2.name = 'host2'
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
    Support::DummyDynflowAction.any_instance.stubs(:exit_status).returns("0")

    job_invocation
  end

  def read_jsonl(jsonl)
    jsonl.lines.map { |l| JSON.parse(l) }
  end
end
