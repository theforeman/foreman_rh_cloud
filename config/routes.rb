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

    resources :tasks, only: [:create]
  end

  namespace :insights_cloud do
    resources :tasks, only: [:create]
    resource :settings, only: [:show, :update]
    get 'hits/:host_id', to: 'hits#index'
  end

  namespace :foreman_rh_cloud do
    get 'inventory_upload', to: 'react#inventory_upload'
    get 'insights_cloud', to: 'react#insights_cloud'
  end

  scope :module => :redhat_access, :path => :redhat_access do
    scope '/r/insights' do
      match '/*path', :constraints => lambda { |req| !req.path.ends_with?('branch_info') }, to: 'machine_telemetries#forward_request', via: [:get, :post, :delete,:put, :patch]
    end
  end
end
