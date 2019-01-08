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

async function updateGroup(ds, navigation_id, group_ids, user_id) {
    return new Promise(function (resolve, reject) {
        // remove the user from all the group
        ds.db.collection('core.group')
            .updateMany(
                { navigation_id: navigation_id }
                , { $pull: { users: user_id } }
                , (err, res) => {
                    if (err) reject(err)

                    // add user to the specified group
                    ds.db.collection('core.group')
                        .updateMany(
                            { $and: [{ navigation_id: navigation_id }, { _id: { $in: group_ids.map(x => ObjectID(`${x}`)) } }] }
                            , { $push: { users: user_id } }
                            , (err, res) => {
                                if (err) reject(err)
                                resolve(true)
                            }
                        )

                }
            )


    })
}

async function run() {

    // check if it is admin mode
    let adminMode = false
    if(res.locals.configuration) {
        let config = jsonic(res.locals.configuration)
        if(config.admin == true) adminMode = true
    }

    // form values
    let data = Object.assign({}, req.query, req.body)

    // get navigation_id
    let navigation_id = req.headers['x-app-key']
    if (!navigation_id) return {error: "No X-App-Key specified"}
    if(adminMode == true) navigation_id = data.navigation_id

    // Get Group ID
    let group_ids = data.group_id
    if (!group_ids || group_ids.Length == 0) return { error: 'No Group Specified.' }

    // data validation - id and password is mandatory
    if (!data.id) return { error: 'id is mandatory field' }

    // retrieve data service
    let ds = res.locals.ds
    if (!ds) return { error: 'No data service instantiated' }

    // connect to database
    await ds.connect()

    // if user exists then process as existing user
    // if _id exists - Is it existing user?
    if (data._id) {
        // Find user
        let filter = { $and: [{ _id: ObjectID(`${data._id}`) }] }
        let users = await ds.find('core.user', filter)
         if (users.length > 0) {
            let user = users[0]

            // check if the password matches
            if( data.password && user.password != data.password )
                if (user.password != hash.hash(data.password))
                    return { error: `password doesn't match` }

            // update user password
            if( data.password ) data.password = hash.hash(data.password)

            // process default fields
            setDefaultData(data, navigation_id)
            let updatedUserId = await ds.update('core.user', data);

            // update group
            await updateGroup(ds, navigation_id, group_ids, `${updatedUserId}`)

            return { _id: updatedUserId }
        }
    }
    else {
        // Find user
        let filter = { $and: [{ navigation_id: navigation_id }, { id: data.id }] }
        let users = await ds.find('core.user', filter)
        if (users.length > 0) return { error: 'same id already exists' }

        // new user creation
        data.password = hash.hash(`${data.password || 12345678}`)

        // process default fields
        setDefaultData(data, navigation_id)
        let updatedUserId = await ds.update('core.user', data);

        // update group
        await updateGroup(ds, navigation_id, group_ids, `${updatedUserId}`)

        return { _id: updatedUserId }
    }

    return {error: 'no matching user found'}

}

run()
