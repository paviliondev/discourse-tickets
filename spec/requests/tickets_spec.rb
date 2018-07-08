require 'rails_helper'

describe "a basic request for tickets" do
  it "responds successfully" do
    get '/tickets/tickets/'

    expect(response).to be_successful
  end
end