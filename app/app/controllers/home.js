'use strict';

var mongoose = require('mongoose'),
    _ = require('underscore'),
    CSSClass = mongoose.model('CSSClass');
    // CSSClassUse = mongoose.model('CSSClassUse');

exports.index = function(req, res) {
    CSSClass.find()
        .sort('className')
        .exec(function(err, cssclasses) {
            if (err) {
                throw new Error(err);
            }
            res.render('home/index', {
                title: 'Speciouss',
                items: cssclasses
            });
        });
};

exports.findClass = function(req, res, next) {
    CSSClass.find({
            className: req.params.className
        },
        function(err, classes) {
            if (err) {
                next(err);
            } else if (classes.length) {
                req.cssClass = classes[0];
                next();
            } else {
                next(new Error('Unknown css class name'));
            }
        });
};

exports.findUsage = function(req, res, next) {
    req.cssClassUse = _.find(req.cssClass.uses, function(x) {
        return x._id === req.params.useID;
    });
    next();
    // CSSClassUse.find({_id: req.params.useID},
    //     function(err, usages) {
    //         if (err) {
    //             next(err);
    //         } else if (usages.lengths) {
    //             req.cssClassUse = usages[0];
    //             next();
    //         } else {
    //             next(new Error('Unknown css class usage id'));
    //         }
    //     });
};

exports.uses = function(req, res) {
    res.render('home/uses', {
        cssClass: req.cssClass,
    });
};


exports.showUse = function(req, res) {
    res.render('home/usage', {
        req: req,
        proxyUrl: 'http://localhost:3000/proxy/' + encodeURIComponent(req.cssClassUse.uri)
    });
};

var regexEscape = function(str) {
    return (str+'').replace(/([.?*+^$\[\]\\(){}|-])/g, '\\$1');
};


exports.search = function(req, res, next) {
    var search = req.query.search;
    var parent = null;
    var parts;
    // Shall we do a descendent or child match?
    if (search.indexOf('>') !== -1) {
        parts  = search.split(/\s*\>\s*/);
        search = parts.splice(-1)[0];
        parts  = _.map(parts, regexEscape);
        parent = parts.join('[^>]+ > '); // normalize
    } else if(search.match(/\s/)) {
        parts  = search.split(/\s+/);
        search = parts.splice(-1)[0];
        parts  = _.map(parts, regexEscape);
        parent = parts.join('.*');
    } else {
        parent = null;
        search = regexEscape(search);
    }
	var matchRX       = new RegExp('(' + search + ')', 'i');
	var parentMatchRX = new RegExp('(' + parent + ')', 'i');

	console.log('Search for', matchRX, parentMatchRX);
	var queryParams = {};
	if (search) {
		queryParams.className = matchRX;
	}
	if (parent) {
		queryParams['uses.element'] = parentMatchRX;
	}
	if (!Object.keys(queryParams).length) {
		res.render('results', {
			query: req.query,
			items: []
		});
		return;
	}

	console.log('Searched for ', queryParams);

	CSSClass
		.find(queryParams)
		.sort({className: 1})
		.exec()
		.then(function(fullDocs) {
			// console.log(fullDocs);
			RegExp.prototype.toJSON = function() { return this.toString(); };
			var matches = {};
			fullDocs.forEach(function(doc) {
				var uses = doc.uses;
                if (parent) {
                    uses =_.filter(doc.uses, function(usage) {
    					return usage.element.match(parentMatchRX);
                        });
                }
                uses.forEach(function(usage) {
                    usage.elementHTML = usage.element
                        .replace('html > ', '')
                        .replace(parentMatchRX, '<span class="match parent">$1</span>')
                        .replace(matchRX, '<span class="match classname">$1</span>');
                });
				console.log(doc.className, uses);
				if (doc.className in matches) {
					matches[doc.className] = matches[doc.className].concat(uses);
				} else {
					matches[doc.className] = uses;
				}
			});
			res.render('results', {
				queryParams: queryParams,
				query:       req.query,
				items:       matches,
				fullDocs:    fullDocs
			});
		})
		.then(null, function(err) {
		    next(err);
		});
};

exports.proxy = function(req, res) {
    if (!req.params.uri) {
        throw new Error('Unkown URI for /proxy: ' + req.url);
    }
    console.error('Proxy url', req.params.uri);

    var request = require('superagent');
    var cheerio = require('cheerio');

    var proxy   = request[req.method.toLowerCase()](req.params.uri);

    // proxy.set(req.headers);

    proxy.on('response', function(proxyResponse) {
        console.log('proxy recvd response', req.params.uri, proxyResponse.type);
        if (proxyResponse.type === 'text/html') {
            console.log('text/html');
            proxyResponse.res.text = 'test';
            // filter the HTML
        } else {
            // passthrough everything else
            console.log('piping');
            req.pipe(proxy).pipe(res);
        }
    });
    proxy.on('data', function(chunk) {
        console.log('proxy.data');
        res.write(chunk, 'binary');
    });
    proxy.end(function(resp) {
        console.log('proxy.end');
        res.writeHead(resp.status, resp.headers);
        res.end(resp.text);
    });

    // req.on('data', function(chunk) {
    //     res.write(chunk, 'binary');
    // });

    // req.on('end', function() {
    //     res.end();
    // });

    // proxy.end(function(apiRes) {
    //     // delete content-encoding
    //     delete apiRes.headers['content-encoding'];
    //     // rewrite content-length
    //     var $ = cheerio.load(apiRes.text);

    //     if (apiRes.type === 'text/html' && !req.params.uri.match(/\.(css|js|jpg|gif|png|woff|ttf|otf)$/) && $) {
    //         console.error('Found HTML, filtering: ', req.params.uri);
    //         $('link').each(function() {
    //             if (!this.attribs.href) {
    //                 return;
    //             }
    //             if (!$(this).attr('href').match(/^http:/)) {
    //                 // rewrite relative links
    //                 $(this).attr('href', req.params.uri + $(this).attr('href'));
    //             }
    //             $(this).attr('href', '/proxy/' + encodeURIComponent($(this).attr('href')));
    //         });
    //         $('script,img').each(function() {
    //             if (!this.attribs.src) {
    //                 return;
    //             }
    //             if (!$(this).attr('src').match(/^http:/)) {
    //                 // rewrite relative links
    //                 $(this).attr('src', req.params.uri + $(this).attr('src'));
    //             }
    //             $(this).attr('src', '/proxy/' + encodeURIComponent(this.src));
    //         });
    //         apiRes.text                      = $.root().html();
    //         apiRes.headers['content-length'] = apiRes.text.length;
    //     }
    //     res.writeHead(apiRes.status, apiRes.headers);
    //     res.end(apiRes.text);
    // });
}
