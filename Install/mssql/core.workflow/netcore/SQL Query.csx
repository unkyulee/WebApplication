// Retrieve DataService
IList<IDataService> DataServices = (IList<IDataService>)Inputs.Get("DataServices");
if (DataServices == null) return "Data Services not provided";
IDataService db = DataServices.FirstOrDefault();
if (db == null) return "Data Service not provided";
db.Connect();

// Query
IWebToolsService web = (IWebToolsService)serviceProvider.GetService(typeof(IWebToolsService));
var result = db.Query(web.Get("query"));

// Return Result
JsonConvert.SerializeObject(
    result,
    new JsonSerializerSettings { Formatting = Formatting.Indented }
)