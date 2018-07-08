module Tickets
  class Color
    def self.all
      PluginStore.get('tickets', 'ticket_colors')
    end

    def self.set_all(ticket_colors)
      PluginStore.set('tickets', 'ticket_colors', ticket_colors)
    end

    def self.get(ticket)
      self.all[ticket]
    end

    def self.set(ticket, color)
      ticket_colors = self.all
      ticket_colors[ticket] = color
      self.set_all(ticket_colors)
    end
  end
end
