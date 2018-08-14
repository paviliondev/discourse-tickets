class Tickets::TicketsController < ::ApplicationController
  def index
    tickets = Tickets::Ticket.find(ticket_params)

    serializer = ActiveModel::ArraySerializer.new(tickets, each_serializer: Tickets::TicketSerializer)

    render json: ::MultiJson.dump(serializer)
  end

  private

  def ticket_params
    params.permit(:order, :ascending, :filter)
  end
end
