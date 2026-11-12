module ForemanInventoryUpload
  module Async
    class HostInventoryReportJob < ::Actions::EntryAction
      def resource_locks
        :link
      end

      def plan(base_folder, organization_id, hosts_filter = "", upload = true)
        organization = Organization.find(organization_id)
        action_subject(organization)

        sequence do
          generate_action = plan_action(
            GenerateHostReport,
            base_folder,
            organization_id,
            hosts_filter
          )
          if upload
            if ForemanInventoryUpload.active_storage?
              plan_action(QueueForUploadJob, generate_action.output[:report_id], organization_id)
            else
              plan_action(QueueForUploadJob, base_folder, ForemanInventoryUpload.facts_archive_name(organization_id, hosts_filter), organization_id)
            end
          end

          if ForemanRhCloud.with_iop_smart_proxy?
            plan_action(
              CreateMissingInsightsFacets,
              organization_id
            )
          end

          plan_self(
            base_folder: base_folder,
            organization_id: organization_id,
            hosts_filter: hosts_filter,
            upload: upload,
            report_id: ForemanInventoryUpload.active_storage? ? generate_action.output[:report_id] : nil
          )
        end
      end

      def run
        return unless input[:report_id]

        report = ForemanInventoryUpload::Report.where(organization_id: input[:organization_id]).find(input[:report_id])
        output[:report_id] = report.id
        output[:report_file] = report.filename
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
        if input[:report_id]
          return nil unless input[:report_id].to_s.match?(/\A\d+\z/)

          report = ForemanInventoryUpload::Report.where(organization_id: input[:organization_id]).find_by(id: input[:report_id])
          return report&.archive&.attached? ? report.filename : nil
        end

        legacy_report_file_path
      end

      def rescue_strategy_for_self
        Dynflow::Action::Rescue::Fail
      end

      private

      def legacy_report_file_path
        filename = ForemanInventoryUpload.facts_archive_name(input[:organization_id], input[:hosts_filter])
        paths = [File.join(input[:base_folder], filename)]
        if input[:upload]
          paths.unshift(
            ForemanInventoryUpload.done_file_path(filename),
            ForemanInventoryUpload.uploads_file_path(filename)
          )
        end
        paths.find { |path| File.exist?(path) }
      end
    end
  end
end
