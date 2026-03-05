module ForemanInventoryUpload
  module Async
    class DestroyOrganizationHbiHostsJob < ::Actions::EntryAction
      include ForemanRhCloud::CertAuth

      def plan(organization_id)
        plan_self(organization_id: organization_id)
      end

      def run
        unless ForemanRhCloud.with_iop_smart_proxy?
          output[:result] = _("Skipping HBI host cleanup: not in IoP mode")
          return
        end

        org = Organization.find_by(id: input[:organization_id])
        unless org
          output[:result] = _("Organization not found")
          return
        end

        logger.info("Destroying all HBI hosts for organization #{org.label} (id: #{org.id})")

        execute_cloud_request(
          organization: org,
          method: :delete,
          url: ForemanInventoryUpload.hosts_delete_all_url,
          headers: {
            content_type: :json,
          }
        )

        output[:result] = _("Successfully deleted all HBI hosts for organization %s") % org.label
      rescue RestClient::NotFound
        output[:result] = _("No HBI hosts found for organization %s") % org&.label
      rescue StandardError => e
        logger.error(_("Failed to destroy HBI hosts for organization %s: %s") % [org&.label, e.message])
        raise
      end

      def logger
        Foreman::Logging.logger('background')
      end

      def rescue_strategy
        Dynflow::Action::Rescue::Skip
      end

      def humanized_name
        _("Destroy HBI hosts for organization")
      end
    end
  end
end
