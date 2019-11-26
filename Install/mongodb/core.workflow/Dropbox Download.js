async function run() {

    // get navigation id
    let navigation_id = req.cookies['x-app-key']
    if (!navigation_id) navigation_id = req.query.navigation_id
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

    // form values
    let data = Object.assign({}, req.query, req.body)
    // get uploaded filestream
    let file = await download(dropbox_api_key, data.filepath)

    // respond with file
    res.setHeader('Content-disposition', `inline; filename=${encodeURIComponent(file.name)}`);
    res.end(file.fileBinary, 'binary')

    return
}

var fetch = require('isomorphic-fetch'); // or another library of choice.
var Dropbox = require('dropbox').Dropbox;
//
async function download(dropbox_api_key, filepath) {
    return new Promise(function (resolve, reject) {
        var dbx = new Dropbox({ accessToken: dropbox_api_key, fetch: fetch });
        dbx.filesDownload({ path: filepath })
            .then(function (file, error) {
                if(error) reject(error)
                resolve(file)
            })
            .catch(function (err) {
                reject(err)
            });
    })
}

run()
