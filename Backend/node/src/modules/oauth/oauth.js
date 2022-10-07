module.exports = {
  // it is going to be redirect based
  // so authentication is difficult to achieve
  async requiresAuthentication() {
    return false;
  },
  async process(db, req, res) {
    // check the url to decide the provider
    let paths = req.url.split("?")[0].split("/");
    if (paths.length != 3) {
      // NOT FOUND
      res.status(404);
      res.end();
      return;
    }

    //
    let provider_name = paths[2];
    const provider = require(`./provider/${provider_name}`);

    return provider.process(db, req, res);
  },
};
