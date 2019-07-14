Rails.application.routes.draw do
  get 'index', to: 'foreman_yupana/react#index'
  get 'reports/last', to: 'foreman_yupana/reports#last'
end
