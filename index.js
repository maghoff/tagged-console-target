var util = require('util');
var winston = require('winston');
var moment = require('moment');

require('colors');

function TaggedConsoleTarget(options) {
	options = options || {};

	winston.Transport.call(this, {
		name: 'taggedConsoleLogger',
		level: options.level,
		handleExceptions: options.handleExceptions,
		exceptionsLevel: options.exceptionsLevel,
		humanReadableUnhandledException: options.humanReadableUnhandledException
	});

	this.target = options.target || process.stdout;

	this.target.on('error', function (err) {
		this.emit('error', err);
	}.bind(this));

	this.prevTimestamp = new Date();
	this.target.write(moment(this.prevTimestamp).format('HH:mm:ss.SSS YYYY-MM-DD dddd').grey + '\n');
};
util.inherits(TaggedConsoleTarget, winston.Transport);

TaggedConsoleTarget.prototype.log = function (level, msg, meta, callback) {
	var colorForLevel = {
		'warn': "yellow",
		'warning': "yellow",
		'error': "red"
	};
	var color = colorForLevel[level];

	meta = meta || {};
	var tags = meta.tags || [];
	var timestamp = meta.timestamp || new Date();

	if (moment(timestamp).format('YYYY-MM-DD') !== moment(this.prevTimestamp).format('YYYY-MM-DD')) {
		this.prevTimestamp = timestamp;
		this.target.write(moment(timestamp).format('HH:mm:ss.SSS YYYY-MM-DD dddd').grey + '\n');
	}

	var header = moment(timestamp).format('HH:mm:ss.SSS').grey + (' [' + tags.join(', ') + ']').green;

	var target = this.target;
	var fullyFlushed = true;
	msg.split('\n').forEach(function (line, index) {
		var coloredLine;
		if (color) coloredLine = line[color];
		else coloredLine = line;

		var separator = [' ', '>'][index === 0 ? 0 : 1].grey;

		fullyFlushed &= target.write(header + separator + coloredLine + '\n');
	});

	if (fullyFlushed) {
		this.emit('logged');
	} else {
		this.target.once('drain', function () {
			this.emit('logged');
		}.bind(this));
	}

	callback(null, true);
};

module.exports = TaggedConsoleTarget;
