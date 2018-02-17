class ErrorsController < ApplicationController
  def render_error
      @exception = env["action_dispatch.exception"]
      @status_code = ActionDispatch::ExceptionWrapper.new(env, @exception).status_code
      render :error_page, status: @status_code, layout: true
  end
end
