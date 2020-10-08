const axios = require("axios");
const obj = require("object-path");

module.exports = {
	match: function (str, rule) {
		// "."  => Find a single character, except newline or line terminator
		// ".*" => Matches any string that contains zero or more characters
		rule = rule.split('*').join('.*');

		// "^"  => Matches any string with the following at the beginning of it
		// "$"  => Matches any string with that in front at the end of it
		rule = '^' + rule + '$';

		//Create a regular expression object for matching string
		var regex = new RegExp(rule);

		//Returns true if it finds a match, otherwise it returns false
		return regex.test(str);
	},

	// escape regular expression
	escapeRegExp: function (string) {
		return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
	},

	getProtocol(req) {
		var proto = req.connection.encrypted ? 'https' : 'http';
		// only do this if you trust the proxy
		proto = req.headers['x-forwarded-proto'] || proto;
		return proto.split(/\s*,\s*/)[0];
	},

	timeout(ms) {
		return new Promise((res) => setTimeout(res, ms));
	},

	async sendAnalytics(req, res) {
		// Retrieve Client ID
		let client_id = obj.get(res, 'locals.token.unique_name');
		// for Tracking data
		const data = {
			v: 1,
			tid: process.env.TID,
			cid: client_id,
			t: 'pageview',
			dh: req.get('host'),
			dp: req.url,
		}
		// send request to Google Analytics
		await axios.get('http://www.google-analytics.com/collect', { params: data });
	}
};
