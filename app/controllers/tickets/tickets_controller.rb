module Tickets
  class TicketsController < ApplicationController
    def index
      render json: Ticket.all
    end

    def show
      ticket = Ticket.find(params[:id])
      render json: ticket
    end
  end
end
