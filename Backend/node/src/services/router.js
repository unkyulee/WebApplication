const cache = require("../lib/cache");

class Router {
  async preProcess(db, req, res) {
    res.header(
      "Access-Control-Allow-Origin",
      process.env.CORS ? process.env.CORS : "*"
    );
    res.header("Access-Control-Allow-Credentials", "true");
    res.header(
      "Access-Control-Allow-Headers",
      "Authorization, Origin, X-Requested-With, Content-Type, Accept, company_id"
    );
    res.header("Access-Control-Expose-Headers", "Authorization");

    // copy back the authorization
    if (req.headers.authorization) {
      res.header("Authorization", req.headers.authorization);
      res.cookie("authorization", req.headers.authorization);
    }

    // copy back the company_id
    if (req.headers["company_id"]) {
      res.cookie("company_id", req.headers["company_id"]);
    }

    // intercept OPTIONS method
    if ("OPTIONS" == req.method) {
      res.sendStatus(200);
      return false;
    }

    // redirect case
    if (req.query.bearer && req.query.company_id) {
      const url = require("url");

      // assign cookie with authentication
      res.cookie("authorization", `Bearer ${req.query.bearer}`);
      res.cookie("company_id", req.query.company_id);

      // should it redirect?
      // image should be displayed in the print page
      // so do not redirect in that case
      if (!req.query.print) {
        // strip out bearer and company_id
        delete req.query.bearer;
        delete req.query.company_id;

        // shall be redirected
        let redirectUrl = url.format({
          pathname: url.parse(req.url).pathname,
          query: req.query,
        });
        res.redirect(redirectUrl);
        return false;
      }
    }

    // otherwise move on to the next process
    return true;
  }

  async resolveNavigation(db, req, res) {
    // first path is the navigation name
    let navName = req.url.split("/")[1];

    let nav;
    if (navName == "api") {
      let apiPath = req.path.split("/")[2];
      let apiName = req.path.split("/")[3];

      let results;

      // check cache 15 minutes
      let cacheKey = `core.websvc_${apiPath}/${apiName}`;
      if (!cache.has(cacheKey) || cache.isExpired(cacheKey, 900)) {
        // cache miss, request database
        results = await db.find("core.websvc", {
          query: {
            url: `${apiPath}/${apiName}`,
          },
        });

        // save to cache
        cache.set(cacheKey, results);

      } else {
        // cache hit
        results = cache.get(cacheKey);        
      }

      // return with result
      if (results && results.length > 0) {
        nav = results[0];
        nav.module = "websvc";
      }
    } else if (navName == "cms") {
      nav = { module: "cms" };
    } else if (navName == "google") {
      nav = { module: "oauth/google" };
    } else if (navName == "dropbox") {
      nav = { module: "oauth/dropbox" };
    } else {
      let results;

      // check cache 15 minutes
      let cacheKey = `core.company_${navName}`;
      if (!cache.has(cacheKey) || cache.isExpired(cacheKey, 900)) {
        // cache miss, request database
        results = await db.find("core.company", {
          query: { url: `/${navName}` },
        });
        // save to cache
        cache.set(cacheKey, results);

      } else {
        // cache hit
        results = cache.get(cacheKey);        
      }

      // if result is not found then load default navigation
      if (results.length == 0) {
        let cacheKey = `core.company_default`;
        if (!cache.has(cacheKey) || cache.isExpired(cacheKey, 900)) {
          // cache miss
          results = await db.find("core.company", { query: { url: `/` } });
          // save cache
          cache.set(cacheKey, results);
        } else {
          // cache hit
          results = cache.get(cacheKey);          
        }
      }        

      // return with result
      if (results && results.length > 0) nav = results[0];
    }

    return nav;
  }
}

module.exports = new Router();
