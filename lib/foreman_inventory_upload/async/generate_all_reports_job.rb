module ForemanInventoryUpload
  module Async
    class GenerateAllReportsJob < ::ApplicationJob
      def perform
        unless Setting[:allow_auto_inventory_upload]
          logger.debug(
            'The scheduled process is disabled due to the "allow_auto_inventory_upload"
            setting being set to false.'
          )
          return
        end

        organizations = Organization.unscoped.all

        organizations.map do |organization|
          total_hosts = ForemanInventoryUpload::Generators::Queries.for_org(organization.id, use_batches: false).count

          if total_hosts <= ForemanInventoryUpload.max_org_size
            GenerateReportJob.perform_later(ForemanInventoryUpload.generated_reports_folder, organization.id)
          else
            logger.info("Skipping automatic uploads for organization #{organization.name}, too many hosts (#{total_hosts}/#{ForemanInventoryUpload.max_org_size})")
          end
        end.compact
      ensure
        self.class.set(:wait => 24.hours).perform_later
      end

      def self.singleton_job_name
        name
      end
    end
  end
end
