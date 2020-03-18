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
          GenerateReportJob.perform_later(ForemanInventoryUpload.generated_reports_folder, organization.id)
        end
      ensure
        self.class.set(:wait => 24.hours).perform_later
      end

      def self.singleton_job_name
        name
      end
    end
  end
end
