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
    db: 'mongodb://localhost/speciouss-dev'
  },

  test: {
    root: rootPath,
    app: {
      name: 'app'
    },
    port: 3000,
    db: 'mongodb://localhost/speciouss-test'
  },

  production: {
    root: rootPath,
    app: {
      name: 'app'
    },
    port: 3000,
    db: 'mongodb://localhost/speciouss-production'
  }
};

module.exports = config[env];
