class Tickets::TicketsController < ::ApplicationController
  def index
    opts = {
      order: ticket_params[:order],
      ascending: ticket_params[:ascending]
    }

    if ticket_params[:filters]
      opts[:filters] = ticket_params[:filters].split(',').map do |f|
        arr = f.split(':')
        {
          field: arr[0],
          value: arr[1]
        }
      end
    end

    tickets = Tickets::Ticket.find(opts)

    guardian = Guardian.new(current_user)
    tickets = tickets.select { |t| guardian.can_see?(t) }

    serializer = ActiveModel::ArraySerializer.new(tickets, each_serializer: Tickets::TicketSerializer)

    render json: ::MultiJson.dump(serializer)
  end

  private

  def ticket_params
    params.permit(:order, :ascending, :filters)
  end
end
