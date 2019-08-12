module ForemanInventoryUpload
  module Async
    class GenerateReportJob < ShellProcess
      def self.output_label(portal_user)
        "report_for_#{portal_user}"
      end

      def perform(result_file, portal_user)
        @result_file = result_file
        @portal_user = portal_user

        super(GenerateReportJob.output_label(portal_user))

        QueueForUploadJob.perform_async(result_file, portal_user)
      end

      def command
        'rake foreman_inventory_upload:report:generate'
      end

      def env
        super.merge(
          'target' => @result_file,
          'portal_user' => @portal_user
        )
      end
    end
  end
end
