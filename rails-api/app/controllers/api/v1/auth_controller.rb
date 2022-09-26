class Api::V1::AuthController < ApplicationController
  skip_before_action :authenticate, only: [:create]

  def create
    @user = User.find_by(username: user_login_params[:username])
    if @user.present? && @user.authenticate(user_login_params[:password]).present?
      token = encode_token(user_id: @user.id)
      data = {
        user: UserSerializer.new(@user),
        token: token
      }
      render json: data, status: :ok
    else
      render json: { error: 'Invalid username or password' }, status: :unauthorized
    end
  end

  private def user_login_params
    params.require(:user).require([:username, :password])
    params.require(:user).permit(:username, :password)
  end
end
