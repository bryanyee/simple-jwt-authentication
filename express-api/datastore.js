const fs = require('fs');

const dataPath = './data.json';
let data;

class DataStore {
  static createUser(attributes) {
    data.users.push({ ...attributes });
    const json = JSON.stringify(data, null, 2);
    fs.writeFileSync(dataPath, json);
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
  const contents = fs.readFileSync(dataPath, { encoding: 'utf8' });
  data = JSON.parse(contents);
}

module.exports = {
  DataStore,
  loadDatastore,
};
