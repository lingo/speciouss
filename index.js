'use strict';

// Global logging reference, so we can swap in loggers
var config   = require('./config');
var db       = require('./database');
var logger   = config.logger;
var huntsman = require('huntsman');

var CSSClass = db.model('CSSClass');

var ABORT = false;

process.on('SIGINT', function() {
	logger.debug('Received SIGINT, stopping...');
	ABORT = true;
});

var cssdb        = require('./cssdb')(db, config);


function main(url) {
	logger.debug('Beginning main(%s)', url);

	var spider = huntsman.spider();
	spider.extensions = [
		huntsman.extension( 'recurse' ), // load recurse extension & follow anchor links
		huntsman.extension( 'cheerio' ), // load cheerio extension
        huntsman.extension( 'stats', { tail: false } )
	];
	var pageMatchRegex = new RegExp(url.replace(/([\/\\?*+.{}\[\]])/g, '\\$1'));

    // HACKY! on('exit') isnt working!?
    var origStop = spider.stop;
    spider.stop = function() {
        //console.log(JSON.stringify(classData, null, '    '));
        origStop();
        logger.debug("STOPPING");
        logger.log('Found CSS', cssdb.getStylesheets());
		process.exit();
    };

	spider.on(pageMatchRegex, function(err, res) {
		if (ABORT) {
			spider.stop();
			return;
		}
		if (err) {
			logger.error(err);
			throw err;
		}

		// use jquery-style selectors & functions
        var type = res.headers['content-type'].split(/;\s*/)[0];
        if (type === 'text/html') {
            var $ = res.extension.cheerio;
            if (typeof $ !== 'function') {
                logger.warn('Non-html found, skipping ', res.uri);
                return;
            }
            $('link').each(function() {
                var $this = $(this);
                if ($this.attr('rel') === 'stylesheet') {
                    cssdb.saveCSSLink($this.attr('href'));
                }
            });
        } else {
            logger.warn('Non-html found, skipping ', res.uri);
            return;
        }

        cssdb.saveClassData($, res);
        logger.debug(res.uri, type);
	});

	spider.on('error', function(err, res) {
		logger.error('huntsman error', err);
	});
	spider.queue.add(url);
	spider.start();
}

// If run from commandline
if (require.main === module || !module.parent) {
	main(process.argv[2]);
} else {
	module.exports.species     = main;
}
