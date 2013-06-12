var util = require('util');
var winston = require('winston');
var moment = require('moment');

require('colors');

function TaggedConsoleTarget(options) {
	options = options || {};

	this.name = 'taggedConsoleLogger';
	this.level = options.level || 'info';
	this.target = options.target || process.stdout;

	this.prevTimestamp = new Date();
	this.target.write(moment(this.prevTimestamp).format('HH:mm:ss.SSS YYYY-MM-DD dddd').grey + '\n');
};
util.inherits(TaggedConsoleTarget, winston.Transport);

TaggedConsoleTarget.prototype.log = function (level, msg, meta, callback) {
	var spec = {
		'info': {
		},
		'warn': {
			color: "yellow"
		},
		'error': {
			color: "red"
		}
	};
	var color = spec[level].color;

	meta = meta || {};
	var tags = meta.tags || [];
	var timestamp = meta.timestamp || new Date();

	if (moment(timestamp).format('YYYY-MM-DD') !== moment(this.prevTimestamp).format('YYYY-MM-DD')) {
		this.prevTimestamp = timestamp;
		this.target.write(moment(timestamp).format('HH:mm:ss.SSS YYYY-MM-DD dddd').grey + '\n');
	}

	var header = moment(timestamp).format('HH:mm:ss.SSS').grey + (' [' + tags.join(', ') + ']').green;

	var target = this.target;
	msg.split('\n').forEach(function (line, index) {
		var coloredLine;
		if (color) coloredLine = line[color];
		else coloredLine = line;

		var separator = [' ', '>'][index === 0 ? 0 : 1].grey;

		target.write(header + separator + coloredLine + '\n');
	});

	callback(null, true);
};

module.exports = TaggedConsoleTarget;
