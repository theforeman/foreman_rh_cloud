module ForemanInventoryUpload
  class UploadsController < ::ApplicationController
    include InventoryUpload::ReportActions

    def download_file
      send_report(params[:organization_id])
    end
  end
end
