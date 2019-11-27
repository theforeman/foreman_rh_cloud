module ForemanInventoryUpload
  module Async
    class GenerateReportJob < ShellProcess
      def self.output_label(label)
        "report_for_#{label}"
      end

      def perform(base_folder, organization)
        @base_folder = base_folder
        @organization = organization

        super(GenerateReportJob.output_label(organization))

        QueueForUploadJob.perform_later(
          base_folder,
          ForemanInventoryUpload.facts_archive_name(organization),
          organization
        )
      end

      def rake_prefix
        'foreman-' unless Rails.env.development?
      end

      def command
        "#{rake_prefix}rake foreman_inventory_upload:report:generate"
      end

      def env
        super.merge(
          'target' => @base_folder,
          'organization_id' => @organization
        )
      end
    end
  end
end
