
var config = require('./config');

var mongoose = require('mongoose');
mongoose.connect(config.dbURI);

var db = mongoose.connection;
db.on('error', function() {
    throw new Error('unable to connect to database at ' + config.dbURI);
});

//db.css.ensureIndex({className: 1}, { unique: true });

require('./app/app/models')(mongoose);

module.exports = db;
