module ForemanRhCloud
  class ReactController < ::ApplicationController
    def inventory_upload
      render 'inventory_upload', :layout => false
    end
  end
end
