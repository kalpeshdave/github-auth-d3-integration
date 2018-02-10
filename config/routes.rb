Rails.application.routes.draw do
  root to: 'home#index'

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  get '/login' => 'sessions#new', :as => :login
  get '/auth/:provider/callback' => 'sessions#create'
  get '/logout' => 'sessions#destroy', :as => :logout
  get '/auth/failure' => 'sessions#failure'

  resources :users, param: :username, path: '/', only: [:show] do
    member do
      get :repos
      get :commits
      get :update_commits
    end
  end
end
