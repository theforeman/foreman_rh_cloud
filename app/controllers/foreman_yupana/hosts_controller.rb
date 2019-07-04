module ForemanYupana
  # Example: Plugin's HostsController inherits from Foreman's HostsController
  class HostsController < ::HostsController
    # change layout if needed
    # layout 'foreman_yupana/layouts/new_layout'

    def new_action
      # automatically renders view/foreman_yupana/hosts/new_action
    end
  end
end
