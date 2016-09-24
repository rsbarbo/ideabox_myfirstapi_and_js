Rails.application.routes.draw do

  root to: 'welcome#index'

  namespace :api do
    namespace :v1 do
      resources :ideas, defaults: {format: 'json'} do
      end
    end
  end

end
