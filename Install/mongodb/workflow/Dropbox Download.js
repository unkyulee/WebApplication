var fetch = require("isomorphic-fetch"); // or another library of choice.
var Dropbox = require("dropbox").Dropbox;

async function run() {
  // get navigation id
  let company_id = req.cookies["company_id"];
  if (!company_id) company_id = req.query.company_id;
  if (!company_id) return "No company_id specified";

  // retrieve data service
  let ds = res.locals.ds;
  if (!ds) return "No data service instantiated";
  // connect to database
  await ds.connect();

  // retrieve config
  let config = await ds.find("config", {
    query: {
      company_id: ObjectID(company_id),
      type: "dropbox"
    }
  });
  if (config.length == 0) return { error: "Config doesn't exist" };
  config = config[0];

  // retrieve dropbox_api_key
  let dropbox_api_key = req.app.locals.encryption.decrypt(
    config.dropbox_api_key
  );
  if (!dropbox_api_key) return { error: "dropbox api key is required" };

  // form values
  let data = Object.assign({}, req.query, req.body);

  // get uploaded filestream
  let file = await download(dropbox_api_key, data.filepath);

  // respond with file
  res.setHeader(
    "Content-disposition",
    `inline; filename=${encodeURIComponent(file.name)}`
  );
  res.end(file.fileBinary, "binary");
  return;
}

//
async function download(dropbox_api_key, filepath) {
  return new Promise(function(resolve, reject) {
    var dbx = new Dropbox({ accessToken: dropbox_api_key, fetch: fetch });
    dbx
      .filesDownload({ path: filepath })
      .then(function(file, error) {
        if (error) reject(error);
        resolve(file);
      })
      .catch(function(err) {
        reject(err);
      });
  });
}

run();
