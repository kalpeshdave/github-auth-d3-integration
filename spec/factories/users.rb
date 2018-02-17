FactoryGirl.define do
  factory :user do
    username "sampleuser"
    email "sample.user@domain.com"
    provider "github"
    uid 12345
    oauth_token "5e7f1a9173e4bb"
  end
end
