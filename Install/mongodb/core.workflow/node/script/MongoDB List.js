﻿var moment = require("moment-timezone");

async function run() {
  // read configuration
  let config = res.locals.configuration;
  if (!config) return "No Configuration Specified";

  config = jsonic(config);
  let collection = config["collection"];
  if (!collection) return "No Collection Specified";

  // form values
  let data = Object.assign({}, req.query, req.body);

  // pagination
  let page = data.page || 1;
  page = parseInt(page);
  let size = data.size || 10;
  size = parseInt(size);

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
  let filter = { $and: [] };

  // check if the configuration has filterFields
  if (config.filterFields) {
    for (let field of config.filterFields) {
      switch (field.type) {
        case "header":
          {
            let value = req.headers[field.key];
            if (!value) return { error: `No ${field.key} specified` };
            let f = {};
            f[field.column] = value;

            // add filter
            filter["$and"].push(f);
          }
          break;
      }
    }
  }

  let options = {};
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
      f[key.replace("_gte", "")] = { $gte: moment(data[key]).toDate() };
      filter.$and.push(f);
    } else if (key.endsWith("_date_gt")) {
      let f = {};
      f[key.replace("_gt", "")] = { $gt: moment(data[key]).toDate() };
      filter.$and.push(f);
    } else if (key.endsWith("_date_lte")) {
      let f = {};
      f[key.replace("_lte", "")] = { $lte: moment(data[key]).toDate() };
      filter.$and.push(f);
    } else if (key.endsWith("_date_lt")) {
      let f = {};
      f[key.replace("_lt", "")] = { $lt: moment(data[key]).toDate() };
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

  // if $and is empty then remove
  if (filter.$and.length == 0) delete filter.$and;

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

  // remove fields
  if (config.excludeFields) {
    for (let row of result) {
      for (let fields of config.excludeFields) {
        if (row[fields]) delete row[fields];
      }
    }
  }

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
