require 'rails_helper'

RSpec.describe SessionsController, type: :controller do
  describe '#create' do
    before do
      request.env['omniauth.auth'] = OmniAuth.config.mock_auth[:github]
    end

    it 'creates a user' do
      expect { post :create, params: { provider: :github } }.to change{ User.count }.by(1)
    end

    it 'creates a session' do
      expect(session[:user_id]).to be_nil
      post :create, params: { provider: :github }
      expect(session[:user_id]).not_to be_nil
    end

    it 'redirects to the github repositories page' do
      post :create, params: { provider: :github }
      expect(response).to redirect_to repos_user_url(User.last)
    end
  end

  describe '#destroy' do
    before do
      request.env['omniauth.auth'] = OmniAuth.config.mock_auth[:github]
      post :create, params: { provider: :github }
    end

    it 'resets the session' do
      expect(session[:user_id]).not_to be_nil
      delete :destroy
      expect(session[:user_id]).to be_nil
    end

    it 'redirects to the home page' do
      delete :destroy
      expect(response).to redirect_to root_url
    end
  end
end
