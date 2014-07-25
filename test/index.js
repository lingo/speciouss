var should     = require('should');
var assert     = require('assert');

var app = require('../index.js');

function eltAttr(x) {
	return this[0][x];
}
function eltParents() {
	var pArr = [];
	var e = this;
	while(e[0].parent) {
		pArr.push(e[0].parent);
		e = e[0].parent;
	}
	return pArr;
}

function makeElt(sel, parentElt) {
	var elt = [{}];
	var parts = sel.split('.');
	if (parts.length > 1) {
		elt[0]['class'] = parts.slice(1).join(' ');
		sel = parts[0];
	} else {
		elt[0].tagName = parts[0];
	}
	parts = sel.split('#');
	if (parts.length > 1) {
		elt[0].id = parts[1];
		elt[0].tagName = parts[0] || 'div';
	} else {
		elt[0].tagName = parts[0];
	}
	if (parentElt) {
		elt[0].parent = parentElt;
	}
	elt.attr = eltAttr.bind(elt);
	elt.parents = eltParents.bind(elt);
	return elt;
}

describe('Selector function tests', function() {
	it('should return correct selector for an element', function() {
		var elt = makeElt('DIV#mytest.test.new.classnames');

		var sel = app.getSelector(elt);
		sel.should.equal('div#mytest.test.new.classnames');
	});

	it('should return correct selector path for an element', function() {
		var tree = makeElt('a.test', makeElt('div#test', makeElt('body', makeElt('html'))));
		var sel = app.getCSSPath(tree);	
		sel.should.equal('html > body > div#test > a.test');
	});
});

