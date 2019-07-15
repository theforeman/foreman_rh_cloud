Rails.application.routes.draw do
  get 'yupana/index', to: 'foreman_yupana/react#index'
  get 'yupana/reports/last', to: 'foreman_yupana/reports#last'
end
