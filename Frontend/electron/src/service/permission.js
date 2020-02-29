const config = require('./config');

module.exports = {
	permitted(permissions) {
		let allowed = false;
		// give permission i.e. profile.view does profile.* allows?
		let allowed_permissions = config.get('permissions', []);
		//
		for (let permission of permissions) {
			for (let allowed_permission of allowed_permissions) {
				if (this.match(permission, allowed_permission)) {
					allowed = true;
					break;
				}
			}
		}

		return allowed;
	},

	// https://stackoverflow.com/questions/26246601/wildcard-string-comparison-in-javascript
	match(str, rule) {
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
};