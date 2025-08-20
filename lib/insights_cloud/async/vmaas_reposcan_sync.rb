require 'rest-client'

module InsightsCloud
  module Async
    # Triggers VMaaS reposcan sync via IoP gateway when repositories are synced
    class VmaasReposcanSync < ::Actions::EntryAction
      include ::ForemanRhCloud::CertAuth

      # Subscribe to Katello repository sync hook action, if available
      def self.subscribe
        'Actions::Katello::Repository::SyncHook'.constantize
      rescue NameError
        Rails.logger.debug('VMaaS reposcan sync: Repository::SyncHook action not found')
        nil
      end

      def plan(repo, *_args)
        return unless ::ForemanRhCloud.with_iop_smart_proxy?

        repo_id = repo.is_a?(Hash) ? (repo[:id] || repo['id']) : nil
        unless repo_id
          logger.error("VMaaS reposcan sync: missing repository id in SyncHook plan parameters: #{repo.inspect}")
          return
        end

        plan_self
      end

      def run
        url = ::InsightsCloud.vmaas_reposcan_sync_url

        response = execute_cloud_request(
          method: :put,
          url: url,
          headers: { 'Content-Type' => 'application/json' }
        )

        if response.code >= 200 && response.code < 300
          message = "VMaaS reposcan sync triggered successfully: #{response.code}"
          logger.info(message)
        else
          message = "VMaaS reposcan sync failed with status: #{response.code}, body: #{response.body}"
          logger.error(message)
        end
        output[:message] = message

        response
      rescue RestClient::ExceptionWithResponse => e
        message = "VMaaS reposcan sync failed: #{e.response&.code} - #{e.response&.body}"
        logger.error(message)
        output[:message] = message
        raise
      rescue StandardError => e
        message = "Error triggering VMaaS reposcan sync: #{e.message}, response: #{e.respond_to?(:response) ? e.response : nil}"
        logger.error(message)
        output[:message] = message
        raise
      end

      def rescue_strategy_for_self
        Dynflow::Action::Rescue::Skip
      end

      private

      def logger
        action_logger
      end
    end
  end
end
