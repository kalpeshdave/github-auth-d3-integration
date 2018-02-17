require 'rails_helper'

RSpec.describe ErrorsController, type: :controller do
  describe "calling a missing method" do
    it "response with 404 if page not found" do
      expect { Object.new.foo }.to raise_error { |error|
        expect(error).to be_a(NameError)
      }
    end
  end
end
