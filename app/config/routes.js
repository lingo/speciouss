module.exports = function(app){
    var RouteManager = require('express-shared-routes').RouteManager;
    var routes       = new RouteManager();

	//home route
	var home = require('../app/controllers/home');

    app.param('className', home.findClass);
    app.param('useID',     home.findUsage);

    routes.get({name: 'classes', re: '/'}, home.index);
    routes.all({name: 'search', re: '/search'}, home.search);
    routes.get({name: 'class_uses', re: '/uses/:className'}, home.uses);
    routes.get({name: 'class_use_show', re: '/uses/:className/show/:useID'}, home.showUse);

    routes.all({name: 'proxy', re: '/proxy/:uri'}, home.proxy);

    routes.applyRoutes(app);
};
