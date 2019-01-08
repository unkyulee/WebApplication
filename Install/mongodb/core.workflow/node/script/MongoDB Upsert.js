function encryptSensitiveFields(data, sensitive) {

    // remove sensitive fields
    for (let fields of Object.keys(sensitive)) {
        if (data[fields]) {
            data[fields] = req.app.locals.encryption.encrypt(data[fields])
        }
    }

}


async function setDefaultData(data, navigation_id) {
    // convert to date field
    for (let field of Object.keys(data))
        if (field.endsWith('_date'))
            data[field] = new Date(data[field])

    // convert _created
    data._created = data._created ? new Date(data._created) : new Date()
    data._updated = new Date()

    // asign navigation_id
    data.navigation_id = navigation_id
}

async function run() {
    // read configuration
    let config = res.locals.configuration
    if (!config) return {error: "No Configuration Specified"}

    config = jsonic(config)
    let collection = config['collection']
    if (!collection) return {error: "No Collection Specified"}

    // check if it is admin mode
    let adminMode = false; if (config.admin == true) adminMode = true

    // check if it has sensitive fields
    let sensitive; if (config.sensitive) sensitive = config.sensitive

    // form values
    let data = Object.assign({}, req.query, req.body)

    let navigation_id = req.headers['x-app-key']
    if (!navigation_id) return {error: "No X-App-Key specified"}
    if (adminMode) navigation_id = data.navigation_id

    // retrieve data service
    let ds = res.locals.ds
    if (!ds) return {error: "No data service instantiated"}

    // connect to database
    await ds.connect()

    // process to setup a default field
    setDefaultData(data, navigation_id)

    // process to encrypt sensitive data
    if (sensitive) encryptSensitiveFields(data, sensitive)

    // upsert
    let upsertedId = await ds.update(collection, data)

    // return result
    return { _id: upsertedId }

}

run()
