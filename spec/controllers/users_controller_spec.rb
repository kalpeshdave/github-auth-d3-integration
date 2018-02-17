require 'rails_helper'

RSpec.describe UsersController, type: :controller do
  let(:user) { FactoryGirl.create(:user) }
  let(:current_user) {user}

  describe "GET #repos" do
    before do
      uri = URI('https://api.github.com/repos/sampleusername')
      RestClient = double
      response = double
      response.stub(:code) { 200 }
      response.stub(:body) { Net::HTTP.get(uri) }
      response.stub(:headers) { {} }
      RestClient.stub(:get) { response }
      @repos = JSON.load(response.body)
    end

    it "Displays all public available repositories for @user" do
      get :repos, params: {username: 'sampleusername'}, session: {'user_id' => current_user.id}

      expect(@repos.first['name']).to eq 'samplerepo2'
      expect(@repos.first['owner']['login']).to eq 'sampleusername'
      expect(@repos.size).to eq 2
    end

    it "render the repos template" do
      get :repos, params: {username: 'sampleusername'}, session: {'user_id' => current_user.id}
      expect(response).to render_template("repos")
    end
  end

  describe "GET #commits" do
    before do
      uri = URI('https://api.github.com/sampleusername/samplerepo2/commits')
      RestClient = double
      response = double
      response.stub(:code) { 200 }
      response.stub(:body) { Net::HTTP.get(uri) }
      response.stub(:headers) { {} }
      RestClient.stub(:get) { response }
      @commits = JSON.load(response.body)
    end

    it "Displays all commits for @repo" do
      get :commits, params: {username: 'sampleusername', repo: {name: 'samplerepo2'}}, session: {'user_id' => current_user.id}

      expect(@commits.first['commit']['committer']['name']).to eq "Sample User"
      expect(@commits.first['commit']['committer']['email']).to eq 'sample.user@domain.com'
    end

    it "render the commits template" do
      get :commits, params: {username: 'sampleusername', repo: {name: 'samplerepo2'}}, session: {'user_id' => current_user.id}
      expect(response).to render_template("commits")
    end
  end
end
