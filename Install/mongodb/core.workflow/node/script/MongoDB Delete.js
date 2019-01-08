async function run() {
    // read configuration
    let config = res.locals.configuration
    if (!config) return "No Configuration Specified"

    config = jsonic(config)
    let collection = config['collection']
    if (!collection) return "No Collection Specified"

    // check if it is admin mode
    let adminMode = false
    if(config.admin == true) adminMode = true

    let navigation_id = req.headers['x-app-key']
    if (!navigation_id) return "No X-App-Key specified"

    // form values
    let data = Object.assign({}, req.query, req.body)

    // retrieve data service
    let ds = res.locals.ds
    if (!ds) return "No data service instantiated"

    // connect to database
    await ds.connect()

    // send delete query
    let filter = { $and: [ { navigation_id: navigation_id }, { _id: ObjectID(`${data._id}`) } ] }
    // do not filter by navigation_id if it is adminmode
    if( adminMode == true ) filter.$and = [ { _id: ObjectID(`${data._id}`) } ]

    return await ds.delete(collection, filter)
}

run()
