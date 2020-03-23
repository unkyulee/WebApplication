async function run() {

  // get navigation id
  let company_id = req.headers["company_id"];
  if (!company_id) return "No company_id specified";

  // retrieve data service
  let ds = res.locals.ds;
  if (!ds) return "No data service instantiated";

  // connect to database
  await ds.connect();

  // get dropbox token
  let config = await ds.find("config", {
    query: {
      company_id: ObjectID(company_id),
      type: "dropbox"
    }
  });
  if (config.length == 0) return { error: "Config doesn't exist" };
  config = config[0];

  // get dropbox_api_key
  let dropbox_api_key = req.app.locals.encryption.decrypt(
    config.dropbox_api_key
  );
  if (!dropbox_api_key) return { error: "dropbox api key is required" };

  // folder path
  let folderpath = req.query.folder;
  if (!folderpath) return { error: "no folder path specified" };

  // get uploaded filestream
  let file = await fileContent();

  // upload to dropbox
  folderpath = folderpath.trim();
  let saveTo = `/${encodeNonAsciiCharacters(
    folderpath
  )}/${encodeNonAsciiCharacters(file.filename)}`;
  let result = await upload(dropbox_api_key, saveTo, file.contents);
  return [result];
}

async function fileContent() {
  return new Promise(function(resolve, reject) {
    let _filename;
    var MemoryStream = require("memorystream");
    var memStream = new MemoryStream(null, { readable: false });

    req.busboy.on("file", function(
      fieldname,
      file,
      filename,
      encoding,
      mimetype
    ) {
      // save filename
      _filename = filename;

      // write to the memory buffer
      file.pipe(memStream);
    });

    req.busboy.on("finish", function() {
      resolve({
        filename: _filename,
        contents: Buffer.concat(memStream.queue)
      });
    });

    req.pipe(req.busboy);
  });
}

var fetch = require("isomorphic-fetch"); // or another library of choice.
var Dropbox = require("dropbox").Dropbox;
async function upload(dropbox_api_key, saveTo, contents) {
  return new Promise(function(resolve, reject) {
    var dbx = new Dropbox({ accessToken: dropbox_api_key, fetch: fetch });

    dbx
      .filesUpload({
        path: saveTo,
        contents: contents
      })
      .then(function(response) {
        resolve(encodeURIComponent(saveTo));
      })
      .catch(function(err) {
        reject(JSON.stringify(err));
      });
  });
}

function encodeNonAsciiCharacters(value) {
  let out = "";
  for (let i = 0; i < value.length; i++) {
    const ch = value.charAt(i);
    let chn = ch.charCodeAt(0);
    if (chn <= 127) out += ch;
    else {
      let hex = chn.toString(16);
      if (hex.length < 4) hex = "000".substring(hex.length - 1) + hex;
      out += "\\u" + hex;
    }
  }
  return out;
}

run();
