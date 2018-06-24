require "rails_helper"

module Ticketing
  RSpec.describe "ticket routes", type: :routing do
    routes { Engine.routes }
    it "routes to #index" do
      expect(:get => "/tickets").to route_to("ticketing/tickets#index")
    end

    describe "routes to #show" do
      it "accepts ids prefixed with topic" do
        expect(:get => "/tickets/topic-322").to route_to("ticketing/tickets#show", id: "topic-322")
      end

      it "accepts ids prefixed with post" do
        expect(:get => "/tickets/post-322").to route_to("ticketing/tickets#show", id: "post-322")
      end

      it "doesn't accept ids prefixed with random models" do
        expect(:get => "/tickets/random-322").not_to route_to("ticketing/tickets#show", id: "random-322")
      end

      it "doesn't accept ids without a prefix" do
        expect(:get => "/tickets/322").not_to route_to("ticketing/tickets#show", id: "322")
      end
    end
  end
end