module ForemanInventoryUpload
  class ReactController < ::ApplicationController
    def index
      render 'foreman_inventory_upload/layouts/react', :layout => false
    end
  end
end
