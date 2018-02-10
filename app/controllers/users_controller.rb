class UsersController < ApplicationController
  before_action :authenticate_user!

  def repos
    begin
     res = RestClient.get("https://api.github.com/users/#{current_user.username}/repos")
     @repos = JSON.parse(res.body)
    rescue RestClient::ExceptionWithResponse => err
      logger.error err.response
    end
  end

  def commits
    begin
     if request.xhr?
       logger.info "Github commits api : https://api.github.com/repos/#{current_user.username}/#{params[:repo][:name]}/commits?since=#{params[:since]}&until=#{params[:until]}"
       res = RestClient.get("https://api.github.com/repos/#{current_user.username}/#{params[:repo][:name]}/commits?since=#{params[:since]}&until=#{params[:until]}")
     else
       logger.info "Github commits api : https://api.github.com/repos/#{current_user.username}/#{params[:repo][:name]}/commits?until='#{Time.now.utc.iso8601}'"
       res = RestClient.get("https://api.github.com/repos/#{current_user.username}/#{params[:repo][:name]}/commits")
     end

     @commits = JSON.parse(res.body)
    rescue RestClient::ExceptionWithResponse => err
      logger.error err.response
    end
  end
end
