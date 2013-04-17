#!/usr/bin/env node

var winston = require('winston');
var TaggedConsoleTarget = require('./index');

var logger = new (winston.Logger)({
	transports: [
		new TaggedConsoleTarget()
	]
});

logger.info("Log message 1", {tags: ['module a']});
logger.info("Log message 2", {tags: ['module a', 'submodule a1']});
logger.info("Log message 3", {tags: ['module b']});
