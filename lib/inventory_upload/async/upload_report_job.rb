module InventoryUpload
  module Async
    class UploadReportJob < ShellProcess
      def self.output_label(portal_user)
        "upload_for_#{portal_user}"
      end

      def perform(filename, portal_user)
        @portal_user = portal_user
        @filename = filename

        super(UploadReportJob.output_label(portal_user))
      end

      def command
        File.join(File.dirname(@filename), InventoryUpload.upload_script_file)
      end

      def env
        super.merge(
          'RH_USERNAME' => rh_username,
          'RH_PASSWORD' => rh_password,
          'FILES' => @filename
        )
      end

      def rh_credentials
        @rh_credentials ||= RedhatAccess::TelemetryConfiguration.where(portal_user: @portal_user).last
      end

      def rh_username
        @portal_user
      end

      def rh_password
        rh_credentials.portal_password
      end
    end
  end
end
