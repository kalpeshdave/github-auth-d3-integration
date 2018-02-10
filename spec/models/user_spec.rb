require 'rails_helper'

RSpec.describe User, type: :model do

  before(:each) { @user = FactoryGirl.create(:user) }

  subject { @user }

  it { should respond_to(:email) }

  it "#email returns a string" do
    expect(@user.email).to match 'example_user@domain.com'
  end

end
