const { DataStore } = require('./datastore.js');

class User {
  // @param username <String>
  // @param password <String>, format: bcrypt hash, e.g. '$2b$10$fiB/50MWg9dYWmAttYDud.gWcdrMDXDNdTvZbGMxgeNraItW/u/Vi'
  // @param birthdate <String>, format: "YYYY-MM-DD"
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
      birthdate: this.birthdate,
    };
  }
}

module.exports = {
  User,
};
