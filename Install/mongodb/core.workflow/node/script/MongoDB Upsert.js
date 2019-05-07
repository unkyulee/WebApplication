﻿const hash = require("../lib/hash");

async function verify(ds, config, verifyConfig, data, row) {
  let result = false;

  switch (verifyConfig.type) {
    case "MatchIfExists":
      {
        if (row == null) {
          // verify only when data exists
          result = true;
          break;
        }
        let source = row[verifyConfig.column];
        if (!source) {
          // verify only when data exists
          result = true;
        }

        // is any algorithm applied?
        switch (verifyConfig.algorithm) {
          case "encryption":
            {
              let target = data[verifyConfig.field];
              source = req.app.locals.encryption.decrypt(source);
              result = source == target;
            }
            break;

          case "hash":
            {
              let target = data[verifyConfig.field];
              target = hash.hash(target);
              result = source == target;
            }
            break;
        }
      }
      break;
  }

  return result;
}

async function run() {
  // read configuration
  let config = res.locals.configuration;
  if (!config) return { error: "No Configuration Specified" };

  config = jsonic(config);
  let collection = config["collection"];
  if (!collection) return { error: "No Collection Specified" };

  // form values
  let data = Object.assign({}, req.query, req.body);

  // retrieve data service
  let ds = res.locals.ds;
  if (!ds) return { error: "No data service instantiated" };

  // connect to database
  await ds.connect();

  // retrieve current data
  let rows = await ds.find(config.collection, {
    _id: ObjectID(data._id)
  });
  let row = null;
  if (rows.length > 0) row = rows[0];

  // verify data
  if (config.verify) {
    for (let verifyConfig of config.verify) {
      let valid = await verify(ds, config, verifyConfig, data, row);
      if (!valid) {
        return { error: verifyConfig.message };
      }
    }
  }

  // set default field
  if (config.defaultFields) {
    for (let def of config.defaultFields) {
      switch (def.type) {
        case "Date":
          if(data[def.column]) data[def.column] = new Date(data[def.column]);
          break;
        case "NowIfNew":
          if (!row || !row[def.column]) {
            data[def.column] = new Date();
          } else if(data[def.column]) {
            data[def.column] = new Date(data[def.column]);
          }
          break;
        case "Now":
          data[def.column] = new Date();
          break;
        case "header":
          {
            let value = req.headers[def.key];
            if (!value) return { error: `No ${def.key} specified` };
            data[def.column] = value;
          }
          break;
        case "hash":
          if (data[def.column]) data[def.column] = hash.hash(data[def.column]);
          break;
      }
    }
  }

  // encrypt fields
  if (config.encryptedFields) {
    for (let field of config.encryptedFields)
      data[field] = req.app.locals.encryption.encrypt(data[field]);
  }

  // exclude fields
  if (config.excludeFields) {
    for (let field of config.excludeFields) delete data[field];
  }

  // upsert
  let upsertedId = await ds.update(collection, data);

  // return result
  return { _id: upsertedId };
}

run();
