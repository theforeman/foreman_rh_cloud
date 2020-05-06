module ForemanRhCloud
  class ReactController < ::ApplicationController
    def inventory_upload
      @component_name = 'ForemanInventoryUpload'
      render 'foreman_rh_cloud/layouts/react', :layout => false
    end
  end
end
