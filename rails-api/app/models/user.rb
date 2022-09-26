class User < ApplicationRecord
  validates :username, uniqueness: { case_sensitive: false }
  validates :username, :password_digest, presence: true

  def password
    @password = BCrypt::Password.new(self.password_digest)
  end

  def password=(password)
    @password = BCrypt::Password.create(password)
    self.password_digest = @password
  end

  # Custom implementation instead of using ActiveSupport::SecurePassword
  # https://api.rubyonrails.org/classes/ActiveModel/SecurePassword/ClassMethods.html
  def authenticate(password_param)
    return false unless password == password_param
    self
  end
end
