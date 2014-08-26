'use strict';

var mongoose = require('mongoose'),
    _ = require('underscore'),
    CSSClass = mongoose.model('CSSClass'),
    CSSClassUse = mongoose.model('CSSClassUse');

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
        return x._id = req.params.useID;
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
    })
};


exports.showUse = function(req, res) {
    res.render('home/usage', {
        req: req,
        proxyUrl: 'http://localhost:3000/proxy/' + encodeURIComponent(req.cssClassUse.uri)
    });
}


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
