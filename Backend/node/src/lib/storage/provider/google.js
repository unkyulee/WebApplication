const ObjectID = require("mongodb").ObjectID;
const obj = require("object-path");
const axios = require("axios");
const moment = require("moment");
const MemoryStream = require("memorystream");
const { SYSTEM_USER_COLLECTION } = require("mongodb/lib/db");

module.exports = {
  getToken: async function (db, res, req, params) {
    // retrieve server and get client secrets
    let server = await db.find("server", {});
    if (server && server.length == 0) {
      throw "send failed: server config not found";
    }
    server = server[0];

    // retrieve google config
    let google = await db.find("config", {
      query: {
        type: "google",
        company_id: ObjectID(
          obj.get(res, "locals.token.sub", params.company_id)
        ),
      },
    });
    if (google.length == 0) {
      throw "google drive failed: google config not found";
    }
    google = google[0];

    // retrieve access token
    let token = await axios.post("https://oauth2.googleapis.com/token", {
      grant_type: "refresh_token",
      client_id: obj.get(server, "google.client_id"),
      client_secret: obj.get(server, "google.client_secret"),
      refresh_token: obj.get(google, "refresh_token"),
    });

    // return the token
    return token.data;
  },

  upload: async function (db, res, req, params) {
    // get access token
    let token = await this.getToken(db, res, req, params);

    // get uploaded filestream
    let file = await this.fileContent(req);
    if (file && file.filename && file.filename.filename) {
    }
    if (req.query.filename) file.filename = req.query.filename;

    // folder id
    let folder_id = obj.get(params, "config.folder_id", "root");

    // if folder name is passed then check
    // https://developers.google.com/drive/api/reference/rest/v3/files/list
    let folder = obj.get(req, "query.folder", "").trim();
    if (folder) {
      folder_id = await this.getFolderId(token, folder);
    }

    // upload to google drive
    let response = await axios({
      method: "POST",
      url: "https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable",
      headers: {
        Authorization: `Bearer ${token.access_token}`,
      },
      data: {
        name: file.filename,
        parents: [folder_id],
      },
    });

    // retrieve location and then update the file
    let location = response.headers.location;
    response = await axios({
      method: "PUT",
      url: location,
      headers: {
        Authorization: `Bearer ${token.access_token}`,
        "Content-Range": `bytes 0-${file.contents.length - 1}/${
          file.contents.length
        }`,
      },
      data: file.contents,
    });

    return [response.data.id];
  },

  async getFolderId(token, folder) {
    let url = `https://www.googleapis.com/drive/v3/files?q=`;
    let q = `mimeType='application/vnd.google-apps.folder' and trashed=false and name='${folder}'`;
    url = url + encodeURIComponent(q);
    try {
      let response = await axios({
        method: "GET",
        url,
        headers: {
          Authorization: `Bearer ${token.access_token}`,
        },
      });

      //
      if (response.status == 200) {
        // create the folder
        return obj.get(response.data, "files.0.id");
      }
    } catch (ex) {
      console.log(ex);
    }
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
          if (_filename && _filename.filename) _filename = _filename.filename;

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

  download: async function (db, res, req, params) {
    // get access token
    let token = await this.getToken(db, res, req, params);
    let file_id = obj.get(params, "filepath");

    // download
    try {
      let metadata = await axios({
        method: "GET",
        url: `https://www.googleapis.com/drive/v2/files/${file_id}`,
        headers: {
          Authorization: `Bearer ${token.access_token}`,
        },
      });
      let file = await axios({
        method: "GET",
        responseType: "arraybuffer",
        url: `https://www.googleapis.com/drive/v2/files/${file_id}?alt=media`,
        headers: {
          Authorization: `Bearer ${token.access_token}`,
        },
      });

      // put some header
      res.setHeader(
        "Content-disposition",
        `inline; filename=${encodeURIComponent(metadata.data.title)}`
      );
      for (let header of obj.get(params, "headers", [])) {
        res.setHeader(header.key, header.value);
      }
      res.end(file.data, "binary");
    } catch (ex) {}
  },
};
