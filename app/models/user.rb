class User < ApplicationRecord
  def self.create_with_omniauth(auth)
    create! do |user|
      user.provider = auth['provider']
      user.uid = auth['uid']
      if auth['info']
        user.username = auth['info']['nickname']
         user.email = auth['info']['email']
         user.avatar_url = auth['info']['image'] || ""
         user.oauth_token = auth['credentials']['token']
      end
    end
  end

  def to_param
    username
  end
end
