module InsightsCloud
  module Async
    class CloudConnectorAnnounceTask < ::Actions::EntryAction
      def self.subscribe
        Actions::RemoteExecution::RunHostsJob
      end

      def self.connector_feature_id
        @connector_feature_id ||= RemoteExecutionFeature.feature!(ForemanRhCloud::CloudConnector::CLOUD_CONNECTOR_FEATURE).id
      end

      def plan(job_invocation)
        return unless connector_playbook_job?(job_invocation)

        plan_self
      end

      def finalize(*_args)
        Organization.unscoped.each do |org|
          presence = ForemanRhCloud::CloudPresence.new(org, logger)
          presence.announce_to_sources
        rescue StandardError => ex
          logger.warn(ex)
        end
      end

      def rescue_strategy_for_self
        Dynflow::Action::Rescue::Skip
      end

      def connector_playbook_job?(job_invocation)
        job_invocation&.remote_execution_feature_id == connector_feature_id
      end

      def connector_feature_id
        self.class.connector_feature_id
      end

      def logger
        action_logger
      end
    end
  end
end
