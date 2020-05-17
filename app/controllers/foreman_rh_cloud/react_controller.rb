module ForemanRhCloud
  class ReactController < ::ApplicationController
    layout "foreman_rh_cloud/application"

    def inventory_upload
      @react_props = { currentOrg: Organization.current&.name }.to_json
    end
  end
end
