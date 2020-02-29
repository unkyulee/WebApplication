// services
const config = require('../../../service/config');

// ID of the script
let script_id = `${window.location.hostname}${window.location.pathname}`;
script_id = script_id.replace(/\./g, '_').replace(/\//g, '_');
console.log(`Preload Script ID: ${script_id}`);

// Find the script
let script = config.get(`module.desktop.script.${script_id}`);
if (script) {
	console.log(`Loading ...`);
	try {
		eval(script);
	} catch (ex) {
		console.error(ex);
	}
}
