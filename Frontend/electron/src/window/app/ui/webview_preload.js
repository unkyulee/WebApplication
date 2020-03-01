// services
const config = require('../../../service/config');

// ID of the script
let script_id = `${window.location.hash}`.replace("#", "");
script_id = script_id.replace(/\./g, '_').replace(/\//g, '_');
console.log(`Preload Script ID: ${script_id}`);

// Find the script
let script = config.get(`preload.${script_id}`);
if (script) {
	console.log(`Loading ...`);
	try {
		eval(script);
	} catch (ex) {
		console.error(ex);
		console.log(script)
	}
}
