const ObjectID = require('mongodb').ObjectID;
const cache = require("../lib/cache");

// used by user script
const jsonic = require('jsonic');
const path = require('path');
const obj = require('object-path');
const moment = require('moment-timezone');
const util = require('../lib/utility');
const email = require('../lib/email/email');
const calendar = require('../lib/calendar/calendar');
const storage = require("../lib/storage/storage");
const contact = require("../lib/contact/contact");
const payment = require("../lib/payment/payment");

module.exports.requiresAuthentication = async function requiresAuthentication(db, req, res) {
	let paths = req.path.split('/');
	if (paths.length >= 2) {
		if (paths[2] == 'public')
			// if the api starts with public
			// does not require authentication
			return false;
	}
	return true;
};

module.exports.process = async function process(db, req, res) {
	let result = {};

	// get websvc
	let websvc = res.locals.nav;
	let method = req.method.toLowerCase();

	// load configuration
	res.locals.configuration = websvc[`${method}_configuration`];

	// load dataservices
	if (websvc[`${method}_datasource`]) {

    let dataservices;

    // check cache 15 minutes    
    let cacheKey = `core.dataservice_${websvc[`${method}_datasource`]}`;
    if (!cache.has(cacheKey) || cache.isExpired(cacheKey, 900)) {
      // cache miss, request database
      dataservices = await db.find('core.dataservice', {
        query: {
          _id: ObjectID(websvc[`${method}_datasource`]),
        },
      });

      // save to cache
      cache.set(cacheKey, dataservices);

    } else {
      // cache hit
      dataservices = cache.get(cacheKey);              
    }
    
    // return with result
		if (dataservices.length > 0) {
			let ds = dataservices[0];
			const MongoDB = require('../db/mongodb');
			res.locals.ds = new MongoDB(ds.connectionString, ds.database);
		}
	}

	// load workflow
	let workflow_id = websvc[`${method}_workflow`];
	if (workflow_id) {
    let workflows;

    // check cache 15 minutes
    let cacheKey = `workflow_${workflow_id}`;
    if (!cache.has(cacheKey) || cache.isExpired(cacheKey, 900)) {
      // cache miss, request database
      workflows = await db.find('workflow', {
        query: {
          _id: ObjectID(workflow_id),
        },
      });

      // save to cache
      cache.set(cacheKey, workflows);
    } else {
      // cache hit
      workflows = cache.get(cacheKey);            
    }

    // return with result		
		if (workflows.length > 0) {
			let workflow = workflows[0];
      // run script
      try {
        result = await eval(workflow.script);
      } catch(ex) {
        console.error(ex)
      }			
		}
	}

	// release the DB connection used locally
	if (res.locals.ds) res.locals.ds.close();

	return result;
};
