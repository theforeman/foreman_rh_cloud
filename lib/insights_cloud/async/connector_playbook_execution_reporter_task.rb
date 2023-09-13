module InsightsCloud
  module Async
    class ConnectorPlaybookExecutionReporterTask < ::Actions::EntryAction
      include Dynflow::Action::Polling
      include ForemanRhCloud::CertAuth

      def self.subscribe
        Actions::RemoteExecution::RunHostsJob
      end

      def self.connector_feature_id
        @connector_feature_id ||= RemoteExecutionFeature.feature!(:rh_cloud_connector_run_playbook).id
      end

      def plan(job_invocation)
        return unless connector_playbook_job?(job_invocation)

        @job_invocation = job_invocation

        invocation_inputs = invocation_inputs(job_invocation)
        report_url = invocation_inputs['report_url']
        report_interval = [invocation_inputs['report_interval'].to_i, 5].max
        correlation_id = invocation_inputs['correlation_id']

        plan_self(
          current_org_id: job_invocation.targeted_hosts.first.organization_id,
          report_url: report_url,
          report_interval: report_interval,
          job_invocation_id: job_invocation.id,
          correlation_id: correlation_id
        )
      end

      def run(event = nil)
        # Handle skip events
        return if event == Dynflow::Action::Skip

        super
      end

      def rescue_strategy_for_self
        Dynflow::Action::Rescue::Skip
      end

      def done?(current_status = invocation_status)
        ActiveModel::Type::Boolean.new.cast(current_status[:task_state][:task_done_reported])
      end

      def job_finished?
        job_invocation.finished?
      end

      def all_hosts_finished?(current_status)
        current_status[:hosts_state].values.all? do |status|
          ActiveModel::Type::Boolean.new.cast(status['report_done'] == true)
        end
      end

      # noop, we don't want to do anything when the polling task starts
      def invoke_external_task
        poll_external_task
      end

      def poll_external_task
        current_status = invocation_status
        report_job_progress(current_status)
        # record the current state and increment the sequence for the next invocation
        {
          invocation_status: current_status,
        }
      end

      def poll_intervals
        [report_interval]
      end

      private

      def connector_playbook_job?(job_invocation)
        job_invocation&.remote_execution_feature_id == connector_feature_id
      end

      def connector_feature_id
        self.class.connector_feature_id
      end

      def invocation_inputs(job_invocation)
        Hash[
          job_invocation.pattern_template_invocations.first.input_values.map do |input_value|
            [input_value.template_input.name, input_value.value]
          end
        ]
      end

      def job_invocation
        @job_invocation ||= JobInvocation.find(input['job_invocation_id'])
      end

      def report_interval
        @report_interval ||= input['report_interval']
      end

      def correlation_id
        @correlation_id ||= input['correlation_id']
      end

      def host_status(host)
        external_task&.dig('invocation_status', :hosts_state, host)
      end

      def task_done_state
        ActiveModel::Type::Boolean.new.cast(external_task&.dig('invocation_status', :task_state, :task_done_reported))
      end

      def sequence(host)
        host_status(host)&.fetch('sequence', 0).to_i
      end

      def host_done?(host)
        ActiveModel::Type::Boolean.new.cast(host_status(host)&.fetch('report_done', nil))
      end

      def report_url
        input['report_url']
      end

      def invocation_status
        hosts_state = Hash[job_invocation.targeting.hosts.map do |host|
          next unless host.insights&.uuid
          [
            host.insights.uuid,
            task_status(job_invocation.sub_task_for_host(host), host.insights.uuid),
          ]
        end.compact]

        {task_state: {task_done_reported: task_done_state}, hosts_state: hosts_state}
      end

      def task_status(host_task, host_name)
        unless host_task
          return { 'state' => 'unknown' }
        end

        {
          'state' => host_task.state,
          'output' => host_task.main_action.live_output.map { |line| line['output'] }.join("\n"),
          'exit_status' => ActiveModel::Type::Integer.new.cast(host_task.main_action.exit_status),
          'sequence' => sequence(host_name),
          'report_done' => host_done?(host_name),
        }
      end

      def report_job_progress(invocation_status)
        generator = InsightsCloud::Generators::PlaybookProgressGenerator.new(correlation_id)
        all_hosts_success = true

        invocation_status[:hosts_state].each do |host_name, status|
          # skip host if the host already reported that it's finished
          next if ActiveModel::Type::Boolean.new.cast(status['report_done'])

          unless status['state'] == 'unknown'
            sequence = status['sequence']
            generator.host_progress_message(host_name, status['output'], sequence)
            status['sequence'] = sequence + 1 # increase the sequence for each host
          end

          if status['state'] == 'stopped'
            generator.host_finished_message(host_name, status['exit_status'])
            status['report_done'] = true
            all_hosts_success &&= status['exit_status'] == 0
          end
        end

        if (job_finished? || all_hosts_finished?(invocation_status))
          generator.job_finished_message(all_hosts_success)
          invocation_status[:task_state][:task_done_reported] = true
        end

        send_report(generator.generate)
      end

      def send_report(report)
        execute_cloud_request(
          organization: current_org,
          method: :post,
          url: report_url,
          content_type: 'application/vnd.redhat.playbook-sat.v3+jsonl',
          payload: {
            file: wrap_report(report),
            multipart: true,
          }
        )
      end

      # RestClient has to accept an object that responds to :read, :path and :content_type methods
      # to properly generate a multipart message.
      # see: https://github.com/rest-client/rest-client/blob/2c72a2e77e2e87d25ff38feba0cf048d51bd5eca/lib/restclient/payload.rb#L161
      def wrap_report(report)
        obj = StringIO.new(report)
        def obj.content_type
          'application/vnd.redhat.playbook-sat.v3+jsonl'
        end

        def obj.path
          'file'
        end

        obj
      end

      def logger
        action_logger
      end

      def current_org
        Organization.find(input[:current_org_id])
      end
    end
  end
end
