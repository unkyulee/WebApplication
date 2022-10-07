const ObjectID = require("mongodb").ObjectID;
const obj = require("object-path");
const Dropbox = require("dropbox").Dropbox;
const MemoryStream = require("memorystream");

module.exports = {
  async download(db, res, req, params) {
    // get dropbox access token
    let company_id = params.company_id;
    if (!company_id) company_id = obj.get(res, "locals.token.sub");

    let [config] = await db.find("config", {
      query: {
        company_id: ObjectID(company_id),
        type: "dropbox",
      },
    });
    if (!config) {
      throw "dropbox config does not exist";
    }

    // initialize Dropbox
    const dbx = await this.initDBX(config, db);

    // download
    let file = await dbx.filesDownload({ path: obj.get(params, "filepath") });

    // put some header
    res.setHeader(
      "Content-disposition",
      `inline; filename=${encodeURIComponent(file.result.name)}`
    );
    for (let header of obj.get(params, "headers", [])) {
      res.setHeader(header.key, header.value);
    }
    res.end(file.result.fileBinary, "binary");
  },

  async upload(db, res, req, params) {
    // get dropbox access token
    let [config] = await db.find("config", {
      query: {
        company_id: ObjectID(
          obj.get(res, "locals.token.sub", params.company_id)
        ),
        type: "dropbox",
      },
    });
    if (!config) {
      throw "dropbox config does not exist";
    }

    // folder
    if (!obj.get(req, "query.folder")) {
      throw "no folder path specified";
    }
    let folder = obj.get(req, "query.folder", "").trim();

    // get uploaded filestream
    let file = await this.fileContent(req);
    if (req.query.filename) file.filename = req.query.filename;
    if (obj.get(file.filename, "filename"))
      file.filename = file.filename.filename;

    // upload to dropbox
    let result = await this.uploadDropbox(
      config,
      db,
      `/${folder}/${file.filename}`,
      file.contents
    );
    return [result];
  },

  async fileContent(req) {
    return new Promise(function (resolve, reject) {
      let _filename;
      var memStream = new MemoryStream(null, { readable: false });
      req.busboy.on(
        "file",
        function (fieldname, file, filename, encoding, mimetype) {
          // save filename
          _filename = filename;
          // write to the memory buffer
          file.pipe(memStream);
        }
      );
      req.busboy.on("finish", function () {
        resolve({
          filename: _filename,
          contents: Buffer.concat(memStream.queue),
        });
      });
      req.pipe(req.busboy);
    });
  },

  async uploadDropbox(config, db, saveTo, contents) {
    // initialize Dropbox
    const dbx = await this.initDBX(config, db);

    await dbx.filesUpload({
      path: saveTo,
      contents: contents,
      strict_conflict: false,
    });

    return saveTo;
  },

  async initDBX(config, db) {
    let dbx;
    if (config.refresh_token) {
      // retrieve server and get client secrets
      let server = await db.find("server", {});
      if (server && server.length == 0) {
        throw "send failed: server config does not found";
      }
      if (
        !obj.get(server, "0.dropbox.client_id") ||
        !obj.get(server, "0.dropbox.client_secret")
      ) {
        throw "send failed: dropbox server config does not found";
      }
      server = server[0];
      //
      dbx = new Dropbox({
        clientId: obj.get(server, "dropbox.client_id"),
        clientSecret: obj.get(server, "dropbox.client_secret"),
        refreshToken: obj.get(config, "refresh_token"),
      });
    } else {
      // long lived access token
      dbx = new Dropbox({ accessToken: config.access_token });
    }

    return dbx;
  },
};
