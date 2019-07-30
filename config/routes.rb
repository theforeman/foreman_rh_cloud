Rails.application.routes.draw do
  namespace :foreman_yupana do
    get 'index', to: 'react#index'
    get ':portal_user/reports/last', to: 'reports#last'
    get ':portal_user/uploads/last', to: 'uploads#last'
  end
end
