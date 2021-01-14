Rails.application.routes.draw do
  namespace :foreman_inventory_upload do
    get ':organization_id/reports/last', to: 'reports#last', constraints: { organization_id: %r{[^\/]+} }
    post ':organization_id/reports', to: 'reports#generate', constraints: { organization_id: %r{[^\/]+} }
    get ':organization_id/uploads/last', to: 'uploads#last', constraints: { organization_id: %r{[^\/]+} }
    get ':organization_id/uploads/file', to: 'uploads#download_file', constraints: { organization_id: %r{[^\/]+} }
    get 'accounts', to: 'accounts#index'
    get 'auto_upload', to: 'uploads#show_auto_upload'
    post 'auto_upload', to: 'uploads#auto_upload'
    post 'host_obfuscation', to: 'uploads#host_obfuscation'
    post 'installed_packages_inclusion', to: 'uploads#installed_packages_inclusion'
    post 'ips_obfuscation', to: 'uploads#ips_obfuscation'

    get 'cloud_connector', to: 'uploads#cloud_connector_status'
    post 'cloud_connector', to: 'uploads#enable_cloud_connector'

    resources :tasks, only: [:create]
  end

  namespace :insights_cloud do
    resources :tasks, only: [:create]
    resource :settings, only: [:show, :update]
    resources :hits, except: %i[show] do
      collection do
        get 'auto_complete_search'
      end
    end
    match 'hits/:host_id', to: 'hits#show', via: :get
    post 'save_token_and_sync', to: 'settings#save_token_and_sync'
  end

  namespace :foreman_rh_cloud do
    get 'inventory_upload', to: '/react#index'
    get 'insights_cloud', to: '/react#index' # Uses foreman's react controller
  end
end
