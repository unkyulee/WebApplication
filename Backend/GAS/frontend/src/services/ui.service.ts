import Vue from 'vue';
import data from './data.service';

export default {
	async registerComponents() {
		let components = await data.get('UI');
		for (let c of components) {
			// register the component
			try {
				Vue.component(c._id, eval(c.component));
				console.log(`registered ${c._id}`);
			} catch (ex) {
				console.log(c);
				console.error(ex);
			}
		}
	},
};
