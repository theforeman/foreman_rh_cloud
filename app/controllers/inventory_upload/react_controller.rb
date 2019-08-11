module InventoryUpload
  class ReactController < ::ApplicationController
    def index
      render 'inventory_upload/layouts/react', :layout => false
    end
  end
end
