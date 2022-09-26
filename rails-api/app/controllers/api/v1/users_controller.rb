class Api::V1::UsersController < ApplicationController
  skip_before_action :authenticate, only: [:create]

  def create
    @user = User.new(user_params)
    @user.password = params[:user][:password]
    @user.save
    if @user.valid?
      token = encode_token(user_id: @user.id)
      data = {
        user: UserSerializer.new(@user),
        token: token
      }
      render json: data, status: :created
    elsif @user.errors.details[:username].any?{|error| error[:error] == :taken}
      render json: { error: 'Username already taken' }, status: :unprocessable_entity
    else
      render json: { error: 'Failed to create user' }, status: :unprocessable_entity
    end
  end

  def profile
    data = { user: UserSerializer.new(current_user) }
    render json: data, status: :ok
  end

  private def user_params
    params.require(:user).require([:username, :password])
    ActionController::Parameters.new({
      username: params[:user][:username],
      bio: params[:user][:bio],
      avatar: params[:user][:avatar]
    }).permit(:username, :bio, :avatar)
  end
end
