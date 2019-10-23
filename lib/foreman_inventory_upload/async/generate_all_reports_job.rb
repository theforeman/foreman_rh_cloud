module ForemanInventoryUpload
  module Async
    class GenerateAllReportsJob < ::ApplicationJob
      def perform
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
