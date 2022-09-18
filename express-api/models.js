const { DataStore } = require('./datastore.js');

class User {
  constructor({ username, password, birthdate }) {
    this.username = username;
    this.password = password;
    this.birthdate = birthdate;
  }

  static create({ username, password, birthdate }) {
    if (!username || !password) {
      throw new Error('Missing params.');
    }
    const user = DataStore.findUser({ username });
    if (user) {
      throw new Error('usernameAlreadyExists');
    }
    const attributes = { username, password, birthdate };
    DataStore.createUser({ ...attributes });
    return new User({ ...attributes });
  }

  static find(attributes) {
    const user = DataStore.findUser(attributes);
    if (user) {
      return new User({ ...user });
    }
    return;
  }

  toObject() {
    return {
      username: this.username,
      password: this.password,
      birthdate: this.birthdate,
    };
  }
}

module.exports = {
  User,
};
