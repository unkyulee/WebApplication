const hash = require('../lib/hash')
const jwt = require('jsonwebtoken')
const ObjectID = require('mongodb').ObjectID
const strMatch = require('../lib/strMatch').strMatch

class Auth {

    async canModuleProcess(req, res) {

        // check if the current module requires authentication
        let requiresAuthentication = await res.locals.module.requiresAuthentication(req, res)
        // if authentication is not required then proceed
        if (requiresAuthentication == false) {
            return true
        }

        // check if the request is authenticated
        let isAuthenticated = await this.isAuthenticated(req, res)
        if (isAuthenticated == false) {
            // if not authenticated then try to authenticate the request
            isAuthenticated = await this.authenticate(req, res)
            if (isAuthenticated == false) {
                // clear cookie
                res.clearCookie('x-app-key')
                res.clearCookie('authorization')

                // authentication failed
                res.status(403)
                return false
            }
            else {
                // if authentication is successful then return the angular config
                res.send(await res.locals.module.authenticated(req, res))
                return false
            }
        }

        // check if the request is authorized
        let isAuthorized = await this.isAuthorized(req, res)
        if (isAuthorized == false) {
            // request is not authorized
            res.status(401)
            return false
        }

        // check if it is requesting for validate
        if(req.headers['validate']) {
            res.send(await res.locals.module.authenticated(req, res))
            return false
        }

        // authorized
        return true
    }

    async isAuthenticated(req, res) {
        let authenticated = false

        // do the JWT toekn thingy
        let token
        if (req.headers.authorization)
            token = req.headers.authorization.replace('Bearer ', '')
        // if headers not given check cooikes - only if it is get and file download
        else if (req.cookies.authorization && req.method == "GET") {
            token = req.cookies.authorization.replace('Bearer ', '')
        }
        else if (req.query.bearer && req.method == "GET") {
            token = req.query.bearer
        }

        if (token) {
            res.locals.bearer = token

            try {
                // decoded token will be saved as token in the res.locals
                res.locals.token = jwt.verify(token, req.app.locals.secret)

                // if authentication is expiring soon then issue a new token
                // if half of the time is passed then renew
                let tokenSpan = res.locals.token.exp - res.locals.token.iat
                let currSpan = res.locals.token.exp - new Date() / 1000
                if (tokenSpan / 2 > currSpan) {
                    // create token
                    this.createToken(req, res, res.locals.token.unique_name, res.locals.token.nameid, res.locals.token.roles)
                }

                // authenticated
                authenticated = true
            } catch (e) {
                authenticated = false
            }
        }

        return authenticated
    }

    async isAuthorized(req, res) {

        // check decoded token
        let roleIds = res.locals.token.roles

        // for each role - retrieve allowed and not_allowed rules
        let allowed = {}
        let not_allowed = {}
        for (let roleId of roleIds) {
            let roles = await req.app.locals.db.find('core.role', { _id: ObjectID(roleId) })
            if (roles.length > 0) {
                let role = roles[0]

                if (role.allowed) for (let policy of role.allowed) allowed[policy] = 1
                if (role.not_allowed) for (let policy of role.not_allowed) not_allowed[policy] = 1
            }
        }

        // is it allowed ?
        let authorized = false

        for (let policy of Object.keys(allowed)) {
            let policyUrl = policy.split(":")[0]
            let policyMethod = policy.split(":")[1]
            if (strMatch(req.url, policyUrl) == true && strMatch(req.method, policyMethod) == true) {
                authorized = true
                break
            }
        }

        // is it not allowed
        for (let policy of Object.keys(not_allowed)) {
            let policyUrl = policy.split(":")[0]
            let policyMethod = policy.split(":")[1]
            if (strMatch(req.url, policyUrl) == true && strMatch(req.method, policyMethod) == true) {
                authorized = false
                break
            }
        }

        return authorized
    }

    async authenticate(req, res) {

        let authenticated = false

        // get id, password, navigation_id
        if (req.body.id && req.headers['x-app-key']) {
            // find in the db - 'core.user'
            let results = await req.app.locals.db.find(
                'core.user'
                , { id: req.body.id, navigation_id: req.headers['x-app-key'] }
            )
            if (results.length > 0) {
                let user = results[0]

                // validate password
                if (!user.password && !req.body.password) {
                    authenticated = true
                }
                if (user.password && req.body.password) {
                    let hashedPassword = hash.hash(req.body.password)
                    if (hashedPassword == user.password) {
                        authenticated = true
                    }
                }

                if (authenticated) {
                    // get roles
                    let roles = await this.getRoles(req, res, user)

                    // create token
                    this.createToken(req, res, user.id, user.name, roles)
                }

            }
        }

        return authenticated
    }

    createToken(req, res, id, name, roles) {
        var signOptions = {
            issuer: req.get('host'),
            subject: req.headers['x-app-key'],
            audience: req.get('host'),
            expiresIn: "30d"
        };
        var payload = {
            unique_name: id,
            nameid: name,
            roles: roles
        }
        let token = jwt.sign(payload, req.app.locals.secret, signOptions)
        res.locals.token = jwt.verify(token, req.app.locals.secret)
        res.set('Authorization', `Bearer ${token}`);
    }

    async getRoles(req, res, user) {
        let roleIds = {}

        // get groups
        let groups = await req.app.locals.db.find('core.group', { users: `${user._id}` })
        for (let group of groups) {
            // get roles
            let roles = await req.app.locals.db.find('core.role', { groups: `${group._id}` })
            for (let role of roles) roleIds[`${role._id}`] = 1
        }

        return Object.keys(roleIds)
    }

}

module.exports = new Auth()