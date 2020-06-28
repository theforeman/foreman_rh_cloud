module ForemanInventoryUpload
  module Notifications
    module ManifestImportSuccessNotificationOverride
      extend ActiveSupport::Concern

      def actions
        {
          :links => [
            {
              :href => Rails.application.routes.url_helpers.foreman_rh_cloud_inventory_upload_path,
              :title => _('Enable inventory upload'),
              :external => false,
            },
          ],
        }
      end
    end
  end
end
