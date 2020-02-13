module InsightsCloud
  class ReactController < ::ApplicationController
    def index
      render 'insights_cloud/layouts/react', :layout => false
    end
  end
end
