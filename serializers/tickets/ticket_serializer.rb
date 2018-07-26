module Tickets
  class TicketSerializer < ::ApplicationSerializer
    attributes :title, :status, :priority, :reason

    def title
      object.title
    end

    def status
      Tickets::Ticket.type_tag(tags, 'status')
    end

    def priority
      Tickets::Ticket.type_tag(tags, 'priority')
    end

    def reason
      Tickets::Ticket.type_tag(tags, 'reason')
    end

    def tags
      @tags ||= object.tags.map { |t| t.name }
    end
  end
end
