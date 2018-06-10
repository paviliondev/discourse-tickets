Ticketing::Engine.routes.draw do
  resources :tickets do
  end
  resource :tag_group_configuration
end
