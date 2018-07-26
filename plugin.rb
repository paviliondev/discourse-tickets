# name: discourse-tickets
# about: Tickets system for Discourse
# version: 0.1
# authors:
# url: https://github.com/angusmcleod/discourse-tickets

register_asset 'stylesheets/tickets.scss'

load File.expand_path('../lib/tickets/validator.rb', __FILE__)

after_initialize do
  load File.expand_path("../models/tickets/ticket.rb", __FILE__)
  load File.expand_path('../lib/tickets/engine.rb', __FILE__)
  load File.expand_path('../lib/tickets/version.rb', __FILE__)
  load File.expand_path("../lib/tickets.rb", __FILE__)
  load File.expand_path("../controllers/tickets/tickets_controller.rb", __FILE__)
  load File.expand_path("../serializers/tickets/ticket_serializer.rb", __FILE__)

  Tickets::Engine.routes.draw do
    resources :tickets, only: [:index, :show], constraints: { id: /(topic|post)-\d+/ }
  end

  Discourse::Application.routes.append do
    get '/admin/tickets' => 'admin/plugins#index', constraints: StaffConstraint.new
    mount Tickets::Engine, at: '/tickets', constraints: StaffConstraint.new
  end
end
