const Store = require('electron-store');
const store = new Store();

module.exports = {
	get: function(name, def_value) {
		let value = store.get(name);
		if (!value) value = def_value;
		return value;
	},
	set: function(name, value) {
		if (typeof name == 'object') {
			store.set(name);
		} else if(value) {
			store.set(name, value);
		}
	},
	clear: function() {
		store.clear();
	},
};
