async function run() {
  // get navigation id
  let company_id = req.cookies["company_id"];
  if (!company_id) company_id = req.query.company_id;
  if (!company_id) return "No company_id specified";

  // retrieve data service
  let ds = res.locals.ds;
  if (!ds) return "No data service instantiated";

  // connect to database
  await ds.connect();
  //
  await storage.download(ds, res, req, {
      filepath: req.query.filepath,
      headers: [
        {
          key: "cache-control",
          value: "max-age=864000"
        }
      ]
  })
}

run();
