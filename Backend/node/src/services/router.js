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
    } else if (req.cookies.authorization) {
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
    if (req.query.bearer) {
      // save to cookie
      res.cookie("authorization", req.query.bearer);

      //
      delete req.query.bearer;

      // shall be redirected
      const url = require("url");
      let redirectUrl = url.format({
        pathname: url.parse(req.url).pathname,
        query: req.query,
      });
      res.redirect(redirectUrl);
      return false;
    }

    // otherwise move on to the next process
    return true;
  }

  async resolveNavigation(db, req, res) {
    // first path is the navigation name
    let navName = req.url.split("/")[1];

    let nav;
    if (navName == "api") {
      // api path must be in a format of path / name
      let paths = req.path.split("/");
      if (paths.length >= 4) {
        //
        let apiPath = paths[2];
        let apiName = paths[3];
        let results;

        //
        results = await db.find("core.websvc", {
          query: {
            url: `${apiPath}/${apiName}`,
          },
        });

        // return with result
        if (results && results.length > 0) {
          nav = results[0];
          nav.module = "websvc";
        }
      }
    } else if (navName == "oauth") {
      nav = { module: "oauth/oauth" };
    } else {
      // check if nav can be discovered
      let results = await db.find("core.company", {
        query: { url: `/${navName}` },
      });

      // if result is not found then load default navigation
      if (results.length == 0) {
        results = await db.find("core.company", { query: { url: `/` } });
      }

      if (results && results.length > 0) {
        // found navigation
        nav = results[0];
      } else {
        //console.error("at least one core.company setup should exist", req.url);
      }
    }

    return nav;
  }
}

module.exports = new Router();
