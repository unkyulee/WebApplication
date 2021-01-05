// ID of the script
console.log(window.location.href, window.location.hash)
let script_id = `${window.location.hash}`.replace("#", "");
script_id = script_id.replace(/\./g, '_').replace(/\//g, '_');
console.log(`Preload Script ID: ${script_id}`);

// load the script
const Store = require('electron-store');
let store = new Store();
let script = store.get(`http://${script_id}`);
try {
	if (script) {
		console.log(`Loading ...`);
		eval(script);
	}
} catch(ex) {
	console.error(ex);
	console.log(script_id, script)
}
