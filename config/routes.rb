Rails.application.routes.draw do
  namespace :foreman_inventory_upload do
    get 'index', to: 'react#index'
    get ':organization_id/reports/last', to: 'reports#last', constraints: { organization_id: %r{[^\/]+} }
    post ':organization_id/reports', to: 'reports#generate', constraints: { organization_id: %r{[^\/]+} }
    get ':organization_id/uploads/last', to: 'uploads#last', constraints: { organization_id: %r{[^\/]+} }
    get ':organization_id/uploads/file', to: 'uploads#download_file', constraints: { organization_id: %r{[^\/]+} }
    get 'accounts', to: 'accounts#index'
  end
end
