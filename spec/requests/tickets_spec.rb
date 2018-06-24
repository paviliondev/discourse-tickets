require 'rails_helper'

describe "a basic request for tickets" do
  it "responds successfully" do
    get '/ticketing/tickets/'

    expect(response).to be_successful
  end
end