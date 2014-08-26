
var express  = require('express'),
    mongoose = require('mongoose'),
    fs       = require('fs'),
    config   = require('./config/config');

mongoose.connect(config.db);
var db = mongoose.connection;
db.on('error', function() {
    throw new Error('unable to connect to database at ' + config.db);
});

var modelsPath = __dirname + '/app/models';
require(modelsPath)(mongoose);

var app = express();

app.locals.elementLink = function(cssClass, eltData) {
    var link = '/uses/' + cssClass.className + '/show/' + eltData._id;
    var shortElt = eltData.element.split(/ > /);
    shortElt = shortElt[shortElt.length-1];
    return '<a href="' + link + '" class="element" title="' + eltData.element + '">' + shortElt + '</a>';
};

app.locals.baseURL = function() {
    return 'http://localhost:3000/';
};

require('./config/express')(app, config);
require('./config/routes')(app);

console.log("Specious app listening on localhost:%s", config.port);
app.listen(config.port);
