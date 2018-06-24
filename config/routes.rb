Ticketing::Engine.routes.draw do
  resource :tag_group_configuration
  resources :tickets, only: [:index, :show], constraints: { id: /(topic|post)-\d+/ }
end
