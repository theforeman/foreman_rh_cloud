module ForemanRhCloud
  class ForemanRhCloudController < ApplicationController
    include ForemanRhCloud::IopSmartProxyAccess
    layout 'layouts/react_application'
    skip_before_action :authorize, :only => :index

    before_action :require_iop_smart_proxy, only: [:recommendations]

    def index
      response.headers['X-Request-Path'] = request.path
      render("react/index", formats: [:html])
    end

    def inventory_upload
      index
    end

    def recommendations
      index
    end
  end
end
