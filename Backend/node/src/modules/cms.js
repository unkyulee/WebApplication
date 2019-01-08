const path = require('path')
const fs = require('fs')
const ObjectID = require('mongodb').ObjectID

module.exports.requiresAuthentication = async function requiresAuthentication(req, res) {
    return false;
}

module.exports.process = async function process(req, res) {

    // resolve path
    let paths = req.path.split('/')
    if(res.locals.nav.url == '/')
        // if it is root url then add additional paths
        paths.unshift('')

    // get the filename
    let name = paths[paths.length - 1]

    // if filename is not given then 'index.html' as default
    if(!name) {
        name = 'index.html'
        paths.push('index.html')
    }

    // get folder
    let folder = `/${paths.slice(2, paths.length - 1).join('/')}`

    // search for contents in cms
    let results = await req.app.locals.db.find(
        'cms'
        , {
            navigation_id: `${res.locals.nav._id}`,
            name: name,
            folder: folder
        }
    )
    if( results.length > 0 ) return processContent(req, res, results[0])

    // not found
    res.status(404);
    res.end();
    return
}

async function processContent(req, res, content) {
    if(content.content_type) {
        res.header('Content-type', content.content_type)
    }

    return content.content
}

module.exports.authenticated = async function authenticated(req, res) {
    return
}
