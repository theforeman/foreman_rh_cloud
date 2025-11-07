module ForemanInventoryUpload
  module Async
    class HostInventoryReportJob < ::Actions::EntryAction
      def plan(base_folder, organization_id, hosts_filter = "", upload = true)
        organization = Organization.find(organization_id)
        action_subject(organization)

        plan_self(
          base_folder: base_folder,
          organization_id: organization_id,
          hosts_filter: hosts_filter,
          upload: upload
        )

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

      def organization
        Organization.find(input[:organization_id])
      end

      def organization_id
        input[:organization_id]
      end

      def report_file_path
        filename = ForemanInventoryUpload.facts_archive_name(input[:organization_id], input[:hosts_filter])

        if input[:upload]
          # For upload tasks, check: done folder (uploaded), uploads folder (queued), generated_reports folder (failed upload)
          [
            ForemanInventoryUpload.done_file_path(filename),
            ForemanInventoryUpload.uploads_file_path(filename),
            File.join(input[:base_folder], filename),
          ].find { |path| File.exist?(path) }
        else
          # For generate-only tasks, only check generated_reports folder
          generated_path = File.join(input[:base_folder], filename)
          File.exist?(generated_path) ? generated_path : nil
        end
      end

      def rescue_strategy_for_self
        Dynflow::Action::Rescue::Fail
      end
    end
  end
end
