# JWT Authentication with Rails

### Setup
Setup dependencies:
```
rvm use
bundle install
rake db:setup
```

Store local environment variables (replace "hello_word_secret" with a random string):
```
touch .env
echo "TOKEN_SECRET=hello_word_secret" >> .env
```

### Run server
```
rails server
```

### Requests
To authenticate with a username and password and receive an access token:
```
POST /api/v1/login
  Body:
    {
      "user": {
        "username"=<username>,
        "password"=<password>
      }
    }
```

To make an api call with an access token to a priveleged endpoint:
```
GET /api/v1/profile
  Headers:
    Authorization: Bearer <token>
```

**Other APIs:**

To create a new user, providing a username and password:
```
POST /users/create
  Body:
    {
      "user": {
        "username"=<username>,
        "password"=<password>,
        "bio"=<bio>
      }
    }
```

### Resources
- https://learn.co/lessons/jwt-auth-rails
- https://dev.to/codesalley/ruby-on-rails-api-simple-authentication-with-jwt-1nfe
