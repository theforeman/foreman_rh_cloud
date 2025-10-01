module ForemanInventoryUpload
  module Async
    class HostInventoryReportJob < ::Actions::EntryAction
      def plan(base_folder, organization_id, hosts_filter = "", upload = true)
        sequence do
          plan_action(
            GenerateHostReport,
            base_folder,
            organization_id,
            hosts_filter
          )
          if upload
            plan_action(
              QueueForUploadJob,
              base_folder,
              ForemanInventoryUpload.facts_archive_name(organization_id, hosts_filter),
              organization_id
            )
          end

          if ForemanRhCloud.with_iop_smart_proxy?
            plan_action(
              CreateMissingInsightsFacets,
              organization_id
            )
          end
        end
      end

      def humanized_name
        _("Host inventory report job")
      end

      def organization_id
        input[:organization_id]
      end
    end
  end
end
