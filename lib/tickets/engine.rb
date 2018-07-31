module ::Tickets
  class Engine < ::Rails::Engine
    engine_name "tickets"
    isolate_namespace Tickets
  end
end
