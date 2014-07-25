
var config = require('./config');

var mongojs = require('mongojs');
var db = mongojs(config.dbURI, ['css'] );

//db.css.ensureIndex({className: 1}, { unique: true });

module.exports = db;
