module ForemanInventoryUpload
  module Async
    class GenerateReportJob < ShellProcess
      def self.output_label(label)
        "report_for_#{label}"
      end

      def plan(base_folder, organization_id, disconnected)
        sequence do
          super(
            GenerateReportJob.output_label(organization_id),
            organization_id: organization_id,
            base_folder: base_folder
          )

          plan_action(
            QueueForUploadJob,
            base_folder,
            ForemanInventoryUpload.facts_archive_name(organization_id),
            organization_id
          ) unless disconnected
        end
      end

      def rake_prefix
        'foreman-' unless Rails.env.development?
      end

      def command
        "#{rake_prefix}rake rh_cloud_inventory:report:generate"
      end

      def env
        super.merge(
          'target' => base_folder,
          'organization_id' => organization_id
        )
      end

      def base_folder
        input[:base_folder]
      end

      def organization_id
        input[:organization_id]
      end
    end
  end
end
