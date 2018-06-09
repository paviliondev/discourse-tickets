# name: discourse-ticketing
# about: Ticketing system for Discourse
# version: 0.1
# authors:
# url: https://github.com/angusmcleod/discourse-ticketing

require_relative './lib/ticketing'

add_admin_route 'discourse_ticketing.nav_button_title', 'ticketing'

Discourse::Application.routes.append do
  get '/admin/ticketing' => 'admin/plugins#index', constraints: StaffConstraint.new

  mount Ticketing::Engine, at: '/ticketing', constraints: StaffConstraint.new
end
