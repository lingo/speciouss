var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'app'
    },
    port: 3000,
    db: 'mongodb://localhost/species'
  },

  test: {
    root: rootPath,
    app: {
      name: 'app'
    },
    port: 3000,
    db: 'mongodb://localhost/app-test'
  },

  production: {
    root: rootPath,
    app: {
      name: 'app'
    },
    port: 3000,
    db: 'mongodb://localhost/app-production'
  }
};

module.exports = config[env];
