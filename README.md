TaggedConsoleTarget
===================

A log target for [Winston](https://npmjs.org/package/winston) that expects tagged log messages and writes them with lots of colors to the console or a given output stream.

This module is designed to work together with [`TaggedLogger`](https://npmjs.org/package/tagged-logger).

Install
-------

    npm install tagged-console-target

Example
-------

For this example you need to `npm install winston tagged-console-target`.

	var winston = require('winston');
	var TaggedConsoleTarget = require('tagged-console-target');

	var logger = new (winston.Logger)({
		transports: [
			new TaggedConsoleTarget()
		]
	});

	logger.info("Log message 1", {tags: ['module a']});
	logger.info("Log message 2", {tags: ['module a', 'submodule a1']});
	logger.info("Log message 3", {tags: ['module b']});


Example output:

	16:46:06.004 2013-04-17 Wednesday
	16:46:06.007 [module a] Log message 1
	16:46:06.008 [module a, submodule a1] Log message 2
	16:46:06.008 [module b] Log message 3

Except the output is in *glorious* color!

Options
-------

`TaggedConsoleTarget` accepts one option:

 * **target**: The target output stream. Defaults to `process.stdout`.
