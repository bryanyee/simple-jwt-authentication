class ApplicationController < ActionController::API
  before_action :authenticate

  def encode_token(payload)
    JWT.encode(payload, ENV.fetch('TOKEN_SECRET'))
  end

  def decode_token(token)
    result = JWT.decode(token, ENV.fetch('TOKEN_SECRET'))
    result[0]
  end

  def current_user
    return @current_user if defined? @current_user
    token = auth_header_token
    return nil unless token.present?
    payload = decode_token(token)
    user_id = payload['user_id']
    @current_user = User.find(user_id)
  end

  def logged_in?
    current_user.present?
  end

  def authenticate
    unless logged_in?
      render json: { message: 'Please log in' }, status: :unauthorized
    end
  end

  private def auth_header_token
    # { 'Authorization': 'Bearer <token>' }
    auth_header = request.headers['Authorization']
    return unless auth_header.present?
    auth_header.split(' ')[1]
  end
end
