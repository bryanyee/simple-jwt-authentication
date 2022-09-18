# JWT Authentication with Express

### Run server
```
npm install
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

To make an authenticated api call with an access token:
```
GET /profile
  Headers:
    Authorization: Bearer <token>
```

**Other APIs:**

To create a new user:
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
