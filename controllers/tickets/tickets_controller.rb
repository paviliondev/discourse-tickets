class Tickets::TicketsController < ::ApplicationController
  def index
    tickets = Tickets::Ticket.all
    serializer = ActiveModel::ArraySerializer.new(tickets,
      each_serializer: Tickets::TicketSerializer
    )
    render json: ::MultiJson.dump(serializer)
  end
end
