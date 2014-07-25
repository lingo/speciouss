
var config = {
	dbURI: 'mongodb://localhost/species'
};

var tracer = require('tracer').colorConsole({
	level: 'warn',
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
