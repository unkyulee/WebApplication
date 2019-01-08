async function deleteGroup(ds, navigation_id, user_id) {
    return new Promise(function (resolve, reject) {
        // remove the user from all the group
        ds.db.collection('core.group')
            .updateMany(
                { navigation_id: navigation_id }
                , { $pull: { users: user_id } }
                , (err, res) => {
                    if (err) reject(err)
                    resolve(true)
                }
            )


    })
}

async function run() {

    // get navigation_id
    let navigation_id = req.headers['x-app-key']
    if (!navigation_id) return "No X-App-Key specified"

    // form values
    let data = Object.assign({}, req.query, req.body)

    // retrieve data service
    let ds = res.locals.ds
    if (!ds) return { error: 'No data service instantiated' }

    // connect to database
    await ds.connect()

    // Find user
    let filter = { $and: [{ navigation_id: navigation_id }, { _id: ObjectID(`${data._id}`) }] }
    let users = await ds.find('core.user', filter)
    if( users.length == 0 ) return {error: 'user not found'}

    // delete group
    if( true == await deleteGroup(ds, navigation_id, `${users[0]._id}`) ) {

        // delete user
        return await ds.delete('core.user', filter)

    }
}

run()
