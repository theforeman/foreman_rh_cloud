module ForemanYupana
  class ReactController < ::ApplicationController
    def index
      render 'foreman_yupana/layouts/react', :layout => false
    end
  end
end
