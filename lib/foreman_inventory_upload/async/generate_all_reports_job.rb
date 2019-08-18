module ForemanInventoryUpload
  module Async
    class GenerateAllReportsJob < ::ApplicationJob
      def perform
        portal_users = RedhatAccess::TelemetryConfiguration
                       .where(enable_telemetry: true)
                       .distinct
                       .pluck(:portal_user)
        portal_users.map do |portal_user|
          generated_file_name = File.join(ForemanInventoryUpload.base_folder, "#{portal_user}.tar.gz")            
          GenerateReportJob.perform_later(generated_file_name, portal_user)
        end
      ensure
        self.class.set(:wait => 24.hours).perform_later
      end
    end
  end
end
