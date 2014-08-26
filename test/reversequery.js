'use strict';

var should = require('should');
var assert = require('assert');
var path   = require('path');
var fs     = require('fs');

var app     = require('../reversequery.js');
var cheerio = require('cheerio');

var fixture = path.join(__dirname, 'fixture.html');

describe('Selector function tests', function() {
    var html = fs.readFileSync(fixture);
    var $ = cheerio.load(html);

	it('should return correct selector for an element', function() {
		var elt = $('DIV#mytest.test.new.classnames');

		var sel = app.getSelector($, elt);
		sel.should.equal('div#mytest.test.new.classnames');
	});

	it('should return correct selector path for an element', function() {
		var sel = app.getCSSPath($, $('a.test'));
		sel.should.equal('html > body > div#mytest.test.new.classnames > a.test');
	});
});

