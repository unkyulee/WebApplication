var moment = require("moment-timezone");

function removeSensitiveFields(rows, sensitive) {
  // remove sensitive fields
  for (let row of rows) {
    for (let fields of Object.keys(sensitive)) {
      if (row[fields]) delete row[fields];
    }
  }
}

async function run() {
  // read configuration
  let config = res.locals.configuration;
  if (!config) return "No Configuration Specified";

  config = jsonic(config);
  let collection = config["collection"];
  if (!collection) return "No Collection Specified";

  // check if it is admin mode
  let adminMode = false;
  if (config.admin == true) adminMode = true;

  // check if it has sensitive fields
  let sensitive;
  if (config.sensitive) sensitive = config.sensitive;

  let navigation_id = req.headers["x-app-key"];
  if (!navigation_id) return "No X-App-Key specified";

  // form values
  let data = Object.assign({}, req.query, req.body);

  // pagination
  let page = data.page || 1;
  page = parseInt(page);
  let size = data.size || 10;
  size = parseInt(size);

  // if export is specified then increase the size
  if (data._export) size = "10000";

  // sort
  let sort = null;
  if (data._sort) {
    sort = {};
    sort[data._sort] = 1;
  }
  if (data._sort_desc) {
    sort = {};
    sort[data._sort_desc] = -1;
  }

  // build filter
  let filter = { $and: [{ navigation_id: navigation_id }] };
  let options = {};

  // do not filter by navigation_id if it is adminmode
  if (adminMode == true) filter.$and = [{ _id: { $exists: true } }];

  for (let key of Object.keys(data)) {
    if (key === "page") continue;
    else if (key === "size") continue;
    else if (key === "_export") continue;
    else if (key === "_aggregation") continue;
    else if (key === "_sort") continue;
    else if (key === "_sort_desc") continue;
    // _id gets ObjectId wrapper
    else if (key === "_id") filter.$and.push({ _id: ObjectID(data[key]) });
    // search
    else if (key === "_search") {
      if (data[key]) {
        filter.$and.push({
          $text: {
            $search: data[key]
          }
        });
        options = { score: { $meta: "textScore" } };
        sort = { score: { $meta: "textScore" } };
      }
    }

    // range
    else if (key.endsWith("_date_gte")) {
      let f = {};
      f[key.replace("_gte", "")] = { $gte: moment.utc(data[key]).toDate() };
      filter.$and.push(f);
    } else if (key.endsWith("_date_gt")) {
      let f = {};
      f[key.replace("_gt", "")] = { $gt: moment.utc(data[key]).toDate() };
      filter.$and.push(f);
    } else if (key.endsWith("_date_lte")) {
      let f = {};
      f[key.replace("_lte", "")] = { $lte: moment.utc(data[key]).toDate() };
      filter.$and.push(f);
    } else if (key.endsWith("_date_lt")) {
      let f = {};
      f[key.replace("_lt", "")] = { $lt: moment.utc(data[key]).toDate() };
      filter.$and.push(f);
    }
    // expression
    else if (key.endsWith("$")) {
      let f = {};
      f[key.substring(0, key.length - 1)] = eval(data[key]);
      filter.$and.push(f);
    }
    // otherwise, string filter
    else {
      // if it is array make an or filter
      if (Array.isArray(data[key])) {
        let or = { $or: [] };
        for (let v of data[key]) {
          let f = {};
          f[key] = v;
          or.$or.push(f);
        }
        filter.$and.push(or);
      } else if (data[key]) {
        let f = {};
        f[key] = new RegExp(data[key], "ig");
        filter.$and.push(f);
      }
    }
  }

  // retrieve data service
  let ds = res.locals.ds;
  if (!ds) return "No data service instantiated";

  // connect to database
  await ds.connect();

  // query to the collection
  let result = [];
  if (data._aggregation)
    result = await ds.aggregate(collection, filter, jsonic(data._aggregation));
  else
    result = await ds.find(
      collection,
      filter,
      sort,
      size,
      (page - 1) * size,
      options
    );
  let total = await ds.count(collection, filter);

  // remove sensitive fields
  if (sensitive) removeSensitiveFields(result, sensitive);

  // return result
  return {
    page: page,
    size: result.length,
    total: total,
    filter: filter,
    sort: sort,
    websvc: res.locals.websvcurl,
    data: result
  };
}

run();
