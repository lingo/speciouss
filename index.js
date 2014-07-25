'use strict';

// Global logging reference, so we can swap in loggers
var config = require('./config');
var db = require('./database');
var logger = config.logger;
var huntsman = require('huntsman');

var ABORT = false;

process.on('SIGINT', function() {
	logger.debug('Received SIGINT, stopping...');
	ABORT = true;
});

function getCSSPath(elt, $) {
	var sels = [];
	sels.push(getSelector(elt, $));
	elt.parents().each(function() {
		sels.push(getSelector($(this), $));
	});
	return sels.reverse().join(' > ');
}

function getSelector(elt, $) {
	var sel = elt[0].name.toLowerCase();
	if (elt.attr('id')) {
		sel += '#' + elt.attr('id');
	}
	if (elt.attr('class')) {
		sel += '.' + elt.attr('class').split(/\s+/).join('.');
	}
	return sel;
}


function saveClassInfo(data) {
	db.css.save(data, logger.debug);
//	if (!classData[data.className]) {
//		classData[data.className] = [];
//	}
//	classData[data.className].push(data);
}

/**
 *
 * Build a map of CSS data.
 *
 * classname => { element, url }
 */
function saveClassData($, res) {
	var allTags = $('*');
	allTags.each(function() {
        var classes = $(this).attr('class');
        if (classes) {
            var thisSel = getCSSPath($(this), $);
            classes = classes.split(/\s+/);
            classes.forEach(function(cls) {
				saveClassInfo({element: thisSel, url: res.uri, className: cls});
            });
        }
	});
}

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
		var $ = res.extension.cheerio;
		if (typeof $ !== 'function') {
			logger.warn('Non-html found, skipping ', res.uri);
			return;
		}

		saveClassData($, res);
		logger.debug(res.uri);
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
	module.exports.species = main;
	module.exports.getCSSPath = getCSSPath;
	module.exports.getSelector = getSelector;
}
