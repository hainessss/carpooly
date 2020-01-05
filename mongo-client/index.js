const mongoose = require('mongoose');
const api = require('./crud');
const models = require('./models');

mongoose.Promise = global.Promise;

class MongoClient {
  constructor() {
    this.db = null;
    this.models = models;
  }

  get(args) {
    return this.fetch('get', args);
  }

  getOne(args) {
    return this.fetch('getOne', args);
  }

  update(args) {
    return this.fetch('update', args);
  }

  create(args) {
    return this.fetch('create', args);
  }

  applyMiddleware(middlwares) {
    return middlwares.forEach(middleware => {
      this.fetch = middleware(this)(this.fetch);
    });
  }

  fetch(method, args) {
    return api[method](args);
  }

  isConnected() {
    return this.db && this.db.connection.readyState === 1;
  }

  async connect(url) {
    if (this.isConnected()) {
      console.log("[mongo] client connected, quick return");
      return this.db;
    }

    try {
      this.db = await mongoose.connect(url, { useNewUrlParser: true });
    } catch (err) {
      console.log('failed to connect to mongo', err);
      return null;
    }
    
    console.log('successfully connected to mongo');

    return this.db;
  }

  close() {
    //close db here
  }
}

module.exports = new MongoClient();
