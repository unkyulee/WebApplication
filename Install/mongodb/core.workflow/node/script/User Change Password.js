async function run() {
    // check if it has admin mode set
    let adminMode = false
    if (res.locals.configuration) {
        let config = jsonic(res.locals.configuration)
        if(config.admin == true) adminMode = true
    }

    // form values
    let data = Object.assign({}, req.query, req.body)

    // get navigation id
    let navigation_id = req.headers['x-app-key']
    if (!navigation_id) return "No X-App-Key specified"
    if(adminMode == true) navigation_id = data.navigation_id

    // retrieve data service
    let ds = res.locals.ds
    if (!ds) return "No data service instantiated"

    // error check
    if( ! data.new_password ) return { error: 'new password missing' }
    if( ! data.new_password_confirm && !adminMode ) return { error: 'repeated password missing' }
    if( data.new_password_confirm != data.new_password && !adminMode ) return { error: 'new password and repeated password mismatch' }

    // connect to database
    await ds.connect()

    // find the user
    let filter = { $and: [ { navigation_id: navigation_id }, { _id: ObjectID(data._id) } ] }
    let results = await ds.find('core.user', filter)
    if( results.length == 0 ) return { error: 'user not found' }
    let user = results[0]

    // verify the password
    if( adminMode == false )
        // check if the password matches
        if( user.password && user.password != hash.hash(data.old_password) )
            return {error: `password doesn't match`}

    // update password
    user.password = hash.hash(data.new_password)
    let id = await ds.update('core.user', user)

    // return result
    return { id: id }
}

run()
