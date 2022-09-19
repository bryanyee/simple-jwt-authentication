const fs = require('fs');

const DATA_PATH = './data.json';

let data;

class DataStore {
  static createUser(attributes) {
    data.users.push({ ...attributes });
    const json = JSON.stringify(data, null, 2);
    fs.writeFileSync(DATA_PATH, json);
  }

  static findUser(attributes) {
    const keys = Object.keys(attributes);
    return data.users.find(function(user) {
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        if (user[key] !== attributes[key]) {
          return false;
        }
      }
      return true;
    });
  }
}

function loadDatastore() {
  const contents = fs.readFileSync(DATA_PATH, { encoding: 'utf8' });
  data = JSON.parse(contents);
}

module.exports = {
  DataStore,
  loadDatastore,
};
