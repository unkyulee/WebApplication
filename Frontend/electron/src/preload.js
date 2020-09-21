// ID of the script
console.log(window.location.href, window.location.hash)
let script_id = `${window.location.hash}`.replace("#", "");
script_id = script_id.replace(/\./g, '_').replace(/\//g, '_');
console.log(`Preload Script ID: ${script_id}`);

// load the script
const Store = require('electron-store');
window.store = new Store();

// Find the script
let url = `${window.store.get('service_url')}/ui.element?uiElementId=${script_id}`;
url = url.replace(/\./g, '_');
let script = window.store.get(`local.${url}`);
script = JSON.parse(script);
script = script.script;

if (script) {
	console.log(`Loading ...`);
	try {
		eval(script);
	} catch (ex) {
		console.error(ex);
		console.log(script)
	}
}
