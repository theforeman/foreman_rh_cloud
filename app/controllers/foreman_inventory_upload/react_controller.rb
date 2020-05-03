module ForemanInventoryUpload
  class ReactController < ::ApplicationController
    def index
      render 'foreman_rh_cloud/layouts/react', :layout => false
    end
  end
end
