module Ticketing
  class TagGroupConfigurationsController < ApplicationController
    def show
      render json: TagGroupConfiguration.instance
    end
  end
end