async function run() {
  // get navigation id
  let company_id = req.headers["company_id"];
  if (!company_id) return "No company_id specified";

  // retrieve data service
  let ds = res.locals.ds;
  if (!ds) return "No data service instantiated";

  // connect to database
  await ds.connect();

  // upload to dropbox
  let result = await storage.upload(ds, res, req)

  return result;
}

run();
