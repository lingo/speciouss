
var config = {
	dbURI: 'mongodb://localhost/speciouss-dev'
};

var tracer = require('tracer').colorConsole({
	level: 'debug',
	format: [
		'{{title}} {{message}}',
		{
			error: '{{title}} {{message}} in {{file}}::{{line}}\n\tStack: {{stack}}',
			debug: '{{title}} {{message}} in {{file}}::{{line}}'
		}
	]
});

config.logger = tracer;

module.exports = config;
