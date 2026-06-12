Rails.application.routes.draw do
  namespace :foreman_inventory_upload do
    post ':organization_id/reports', to: 'reports#generate', constraints: { organization_id: %r{[^\/]+} }
    get ':organization_id/uploads/file', to: 'uploads#download_file', constraints: { organization_id: %r{[^\/]+} }
    get 'missing_hosts', to: 'missing_hosts#index'
    get 'accounts', to: 'accounts#index'
    get 'settings', to: 'uploads_settings#index'
    post 'setting', to: 'uploads_settings#set_advanced_setting'

    resources :tasks, only: [:create, :show]

    get 'status', to: 'cloud_status#index'
  end

  namespace :insights_cloud do
    resources :tasks, only: [:create]
    resource :settings, only: [:show, :update]
    resources :hits, only: [:index] do
      collection do
        get 'auto_complete_search'
        get 'resolutions', to: 'hits#resolutions'
      end
    end
    match 'hits/:host_id', to: 'hits#show', via: :get

    post ':organization_id/parameter', to: 'settings#set_org_parameter', constraints: { organization_id: %r{[^\/]+} }

    match '/*path', constraints: { path: %r{api/[^\?]+} }, to: 'ui_requests#forward_request', via: :all
  end

  namespace :foreman_rh_cloud do
    get 'inventory_upload', to: 'foreman_rh_cloud#inventory_upload'
    get 'recommendations', to: 'foreman_rh_cloud#recommendations'
    get 'recommendations/pathways/:slug', to: 'foreman_rh_cloud#recommendations'
    get 'recommendations/:rule_id', to: 'foreman_rh_cloud#recommendations'
    get 'insights_cloud', to: '/react#index' # Uses foreman's react controller
    get 'insights_vulnerability', to: '/react#index'
    get 'insights_vulnerability/:cve_id', to: '/react#index'
    scope 'insights_compliance' do
      get 'reports', to: '/react#index'
      get 'reports/:report_id', to: '/react#index'
      get 'reports/:report_id/delete', to: '/react#index'
      get 'scappolicies', to: '/react#index'
      get 'scappolicies/new', to: '/react#index'
      get 'scappolicies/:policy_id', to: '/react#index'
      get 'scappolicies/:policy_id/edit', to: '/react#index'
      get 'scappolicies/:policy_id/delete', to: '/react#index'
    end
  end

  scope :module => :'insights_cloud/api', :path => :redhat_access do
    scope 'r/insights/v1' do
      get 'branch_info', to: 'machine_telemetries#branch_info'
    end

    scope '/r/insights' do
      match '(/*path)(/)', constraints: ->(req) { !req.path.include?('view/api') }, to: 'machine_telemetries#forward_request', via: [:get, :post, :delete, :put, :patch]
    end
  end

  scope :module => :'insights_cloud/api' do
    match '/api/lightspeed/*path', to: 'machine_telemetries#forward_request', via: :all
  end

  get '/insights_hosts/:uuid', to: 'insights_cloud/ui_requests#translate_insights_host'

  # API routes

  namespace :api, :defaults => { :format => 'json' } do
    scope '(:apiv)', :module => :v2, :defaults => { :apiv => 'v2' }, :apiv => /v1|v2/, :constraints => ApiConstraints.new(:version => 2, :default => true) do
      resources :organizations, :only => [:show] do
        namespace 'rh_cloud' do
          get 'missing_hosts', to: 'inventory#get_hosts'
          get 'report', to: 'inventory#download_file'
          post 'report', to: 'inventory#generate_report'

          post 'inventory_sync', to: 'inventory#sync_inventory_status'
          post 'missing_hosts', to: 'inventory#remove_hosts'
        end
      end

      namespace 'rh_cloud' do
        post 'announce_to_sources', to: 'inventory#announce_to_sources'
        post 'cloud_request', to: 'cloud_request#update'
        get 'advisor_engine_config', to: 'advisor_engine_config#show'

        # Inventory upload task endpoints
        get 'inventory_upload/tasks/current', to: 'foreman_inventory_upload/api/tasks#current'
        get 'inventory_upload/tasks/history', to: 'foreman_inventory_upload/api/tasks#history'
      end

      namespace 'advisor_engine' do
        get 'host_details', to: 'advisor_engine#host_details'
        patch 'upload_hits', to: 'advisor_engine#upload_hits'
      end
    end
  end
end
