Tickets::Engine.routes.draw do
  resources :tickets, only: [:index, :show], constraints: { id: /(topic|post)-\d+/ }
end

Discourse::Application.routes.append do
  get '/admin/tickets' => 'admin/plugins#index', constraints: StaffConstraint.new
  mount Tickets::Engine, at: '/tickets', constraints: StaffConstraint.new
end
