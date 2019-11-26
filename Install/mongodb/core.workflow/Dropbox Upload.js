async function run() {

    // get navigation id
    let navigation_id = req.headers['x-app-key']
    if (!navigation_id) return "No X-App-Key specified"

    // retrieve data service
    let ds = res.locals.ds
    if (!ds) return "No data service instantiated"
    // connect to database
    await ds.connect()

    // get dropbox token
    let config = await ds.find('core.config', { _id: ObjectID(navigation_id) })
    if (config.length == 0) return { error: "Config doesn't exist" }
    config = config[0]
    let dropbox_api_key = req.app.locals.encryption.decrypt(config.dropbox_api_key)
    if (!dropbox_api_key) return { error: 'dropbox api key is required' }

    // folder path
    let folderpath = req.query.folder
    if (!folderpath) return { error: 'no folder path specified' }

    // get uploaded filestream
    let file = await fileContent()

    // upload to dropbox
    let saveTo = `/${folderpath}/${file.filename}`
    let result = await upload(dropbox_api_key, saveTo, file.contents)
    return [result]
}

async function fileContent() {

    return new Promise(function (resolve, reject) {
        let _filename
        var MemoryStream = require('memorystream');
        var memStream = new MemoryStream(null, { readable: false });

        req.busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
            // save filename
            _filename = filename

            // write to the memory buffer
            file.pipe(memStream)

        });

        req.busboy.on('finish', function () {
            resolve({
                filename: _filename,
                contents: Buffer.concat(memStream.queue)
            })
        });

        req.pipe(req.busboy);
    })
}

var fetch = require('isomorphic-fetch'); // or another library of choice.
var Dropbox = require('dropbox').Dropbox;
async function upload(dropbox_api_key, saveTo, contents) {
    return new Promise(function (resolve, reject) {
        var dbx = new Dropbox({ accessToken: dropbox_api_key, fetch: fetch });

        dbx.filesUpload({ path: saveTo, contents: contents })
            .then(function (response) {
                resolve(saveTo);
            })
            .catch(function (err) {
                res.status(500)
                res.send(err)
                reject(JSON.stringify(err));
            });
    })
}

run()
