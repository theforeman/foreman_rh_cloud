Rails.application.routes.draw do
  namespace :foreman_yupana do
    get 'index', to: 'react#index'
    get ':portal_user/reports/last', to: 'reports#last', constraints: { portal_user: %r{[^\/]+} }
    post ':portal_user/reports', to: 'reports#generate', constraints: { portal_user: %r{[^\/]+} }
    get ':portal_user/uploads/last', to: 'uploads#last', constraints: { portal_user: %r{[^\/]+} }
    get ':portal_user/uploads/file', to: 'uploads#download_file', constraints: { portal_user: %r{[^\/]+} }
    get 'statuses', to: 'statuses#index'
  end
end
