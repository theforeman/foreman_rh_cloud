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
  end

  namespace :insights_cloud do
    resources :tasks, only: [:create]
  end

  namespace :foreman_rh_cloud do
    get 'inventory_upload', to: 'react#inventory_upload'
    get 'insights_cloud', to: 'react#insights_cloud'
  end
end
