class Api::V1::UsersController < ApplicationController
  def create
    @user = User.create(user_params)
    if @user.valid?
      render json: { user: UserSerializer.new(@user) }, status: :created
    else
      render json: {
               error: 'Failed to create user',
             },
             status: :unprocessable_entity
    end
  end

  def profile
    render json: {}, status: :ok
  end

  private

  def user_params
    params.require(:user).permit(:username, :password, :bio, :avatar)
  end
end
