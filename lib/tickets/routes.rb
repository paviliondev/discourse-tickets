Tickets::Engine.routes.draw do
  get 'tickets' => 'tickets#index'
end

Discourse::Application.routes.append do
  get '/admin/tickets' => 'admin/plugins#index', constraints: StaffConstraint.new
  mount Tickets::Engine, at: '/', constraints: StaffConstraint.new
end
