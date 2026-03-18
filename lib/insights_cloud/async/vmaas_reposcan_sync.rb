require 'rest-client'

module InsightsCloud
  module Async
    # Triggers VMaaS reposcan sync via IoP gateway when repositories are synced
    class VmaasReposcanSync < ::Actions::EntryAction
      include ::ForemanRhCloud::CertAuth

      HTTP_TOO_MANY_REQUESTS = 429

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

        organization_id = Katello::Repository.find(repo_id).organization_id

        plan_self(organization_id: organization_id)
      end

      def run
        url = ::InsightsCloud.vmaas_reposcan_sync_url

        response = execute_cloud_request(
          organization: organization,
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
        handle_rest_client_error(e)
      rescue StandardError => e
        handle_standard_error(e)
      end

      def rescue_strategy_for_self
        Dynflow::Action::Rescue::Skip
      end

      def organization
        @organization ||= Organization.find(input[:organization_id])
      end

      private

      def handle_rest_client_error(exception)
        if exception.response&.code == HTTP_TOO_MANY_REQUESTS
          message = "VMaaS reposcan sync skipped: another sync already in progress (#{HTTP_TOO_MANY_REQUESTS})"
          logger.warn(message)
        else
          message = "VMaaS reposcan sync failed: #{exception.response&.code} - #{exception.response&.body}"
          logger.error(message)
        end
        output[:message] = message
        # Do NOT raise - let rescue_strategy_for_self Skip handle this
      end

      def handle_standard_error(exception)
        message = "Error triggering VMaaS reposcan sync: #{exception.message}"
        logger.error(message)
        output[:message] = message
        # Do NOT raise - let rescue_strategy_for_self Skip handle this
      end

      def logger
        action_logger
      end
    end
  end
end
