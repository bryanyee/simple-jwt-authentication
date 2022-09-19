# JWT Authentication with Express

### Setup
Setup dependencies:
```
nvm use
npm install
```

Store local environment variables (replace "hello_word_secret" with a random string):
```
touch .env
echo "TOKEN_SECRET=hello_word_secret" >> .env
```

### Run server
```
npm start
```

### Requests
To authenticate with a username and password and receive an access token:
```
POST /authenticate
  Body:
    username=<username>
    password=<password>
```

To make an api call with an access token to a priveleged endpoint:
```
GET /profile
  Headers:
    Authorization: Bearer <token>
```

**Other APIs:**

To create a new user, providing a username and password:
```
POST /users/create
  Body:
    username=<username>
    password=<password>
    birthdate=<birthdate>
```

### Resources
- https://auth0.com/learn/token-based-authentication-made-easy/
- https://www.digitalocean.com/community/tutorials/nodejs-jwt-expressjs
