PER_PAGE = 30

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

    total = tickets.count
    per_page = ticket_params[:per_page] || PER_PAGE
    page = ticket_params[:page].to_i

    offset = page * per_page
    tickets = tickets.offset(offset) if offset > 0
    tickets = tickets.limit(per_page)

    guardian = Guardian.new(current_user)
    tickets = tickets.select { |t| guardian.can_see?(t) }
    serialized_tickets = ActiveModel::ArraySerializer.new(tickets, each_serializer: Tickets::TicketSerializer)

    render_json_dump(
      tickets: serialized_tickets,
      total: total,
      per_page: per_page,
      page: page,
    )
  end

  private

  def ticket_params
    params.permit(:order, :ascending, :filters, :page, :per_page)
  end
end
