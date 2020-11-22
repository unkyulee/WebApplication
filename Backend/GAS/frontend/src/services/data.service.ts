import db from '../db/test';

export default {
	async get(table, filter?) {
		return db[table]
	},
};
