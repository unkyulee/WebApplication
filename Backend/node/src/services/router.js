const angular = require('../modules/angular')
const websvc = require('../modules/websvc')
const cms = require('../modules/cms')

class Router {

    async preProcess(db, req, res) {
        res.header("Access-Control-Allow-Origin", process.env.CORS?process.env.CORS:"*")
        res.header("Access-Control-Allow-Credentials", "true")
        res.header("Access-Control-Allow-Headers", "Authorization, Origin, X-Requested-With, Content-Type, Accept, X-App-Key, Validate")
        res.header('Access-Control-Expose-Headers', 'Authorization')

        // copy back the authorization
        if (req.headers.authorization) {
            res.header('Authorization', req.headers.authorization)
            res.cookie('authorization', req.headers.authorization)
        }

        // copy back the navigation_id
        if (req.headers['x-app-key']) {
            res.cookie('x-app-key', req.headers['x-app-key'])
        }

        // intercept OPTIONS method
        if ('OPTIONS' == req.method) {
            res.sendStatus(200);
            return false;
        }

        // redirect case
        if (req.query.bearer && req.query.navigation_id) {
            const url = require('url')

            // assign cookie with authentication
            res.cookie('authorization', `Bearer ${req.query.bearer}`)
            res.cookie('x-app-key', req.query.navigation_id)

            // should it redirect?
            // image should be displayed in the print page
            // so do not redirect in that case
            if (!req.query.print) {

                // strip out bearer and navigation_id
                delete req.query.bearer
                delete req.query.navigation_id

                // shall be redirected
                let redirectUrl = url.format({
                    pathname: url.parse(req.url).pathname,
                    query: req.query
                })
                res.redirect(redirectUrl);
                return false;

            }
        }

        // otherwise move on to the next process
        return true;
    }

    async resolveNavigation(db, req, res) {

        // first path is the navigation name
        let navName = req.url.split('/')[1]

        // find in the db - 'core.navigation'
        let results = await db.find(
            'core.navigation'
            , { url: `/${navName}` }
        )

        if( results.length == 0 ){
            // if result is not found then load default navigation
            results = await db.find(
                'core.navigation'
                , { url: `/` }
            )
        }

        return results[0]
    }

    async resolveModule(db, req, res) {
        // angular module
        if (res.locals.nav.module == 'angular') return angular
        // websvc module
        else if (res.locals.nav.module == 'websvc') return websvc
        // cms module
        else if (res.locals.nav.module == 'cms') return cms

        //
        return null
    }

}

module.exports = new Router()