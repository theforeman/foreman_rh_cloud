module ForemanInventoryUpload
  class UploadsController < ::ApplicationController
    include InventoryUpload::ReportActions

    def download_file
      filename, file = report_file(params[:organization_id])

      send_file file, disposition: 'attachment', filename: filename
    end
  end
end
