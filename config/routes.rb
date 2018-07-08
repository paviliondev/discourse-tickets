Tickets::Engine.routes.draw do
  resources :tickets, only: [:index, :show], constraints: { id: /(topic|post)-\d+/ }
end
