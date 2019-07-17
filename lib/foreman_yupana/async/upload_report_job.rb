module ForemanYupana
  module Async
    class UploadReportJob < ShellProcess
      def perform(output_label)
        super(output_label)
      end

      def command
        ForemanYupana.upload_script_file
      end

      def env
        super.merge(
          'RH_USERNAME' => rh_username,
          'RH_PASSWORD' => rh_password
        )
      end

      def rh_credentials
        @rh_credentials ||= RedhatAccess::TelemetryConfiguration.not.where(portal_user: nil).last
      end

      def rh_username
        rh_credentials.portal_user
      end

      def rh_password
        rh_credentials.portal_password
      end
    end
  end
end
