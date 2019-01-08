// Parse Configuration
string configuration = Inputs.Get("Configuration")?.ToString();
if (string.IsNullOrEmpty(configuration))
    return JsonConvert.SerializeObject(new { error = "No Configuration Specified."});

JObject config = JsonConvert.DeserializeObject<JObject>(configuration);
string collection = config["collection"]?.ToString();
bool log = false;
if( config["log"] != null )
    log = config["log"].ToObject<bool>();

if (string.IsNullOrEmpty(collection))
    return JsonConvert.SerializeObject(new { error = "No Collection Specified."});


// Get Navigation ID
IHttpContextAccessor context = (IHttpContextAccessor)serviceProvider.GetService(typeof(IHttpContextAccessor));
string navigation_id = context.HttpContext.Request.Headers["X-App-Key"];
if (string.IsNullOrEmpty(navigation_id))
    return JsonConvert.SerializeObject(new { error = "No X-App-Key specified"});

// IWebToolsService
IWebToolsService web = (IWebToolsService)serviceProvider.GetService(typeof(IWebToolsService));
if (web == null) return JsonConvert.SerializeObject(new { error = "Not able to retrieve IWebToolsService"});

// Retrieve DataService
IList<IDataService> DataServices = (IList<IDataService>)Inputs.Get("DataServices");
if (DataServices == null) return JsonConvert.SerializeObject(new { error = "Data Services not provided"});
IDataService db = DataServices.FirstOrDefault();
if (db == null) return JsonConvert.SerializeObject(new { error = "Data Service not provided"});
db.Connect();

// Convert to date
var body = JsonConvert.DeserializeObject<JObject>(web.GetBody());
body["navigation_id"] = navigation_id;

// Send Query
var result = db.Update(collection, body.ToObject<IDictionary<string, object>>(), "_id", log);
if (result == null) return JsonConvert.SerializeObject(new { error = "No Results"});

// Return Result
JsonConvert.SerializeObject(result, new JsonSerializerSettings { Formatting = Formatting.Indented })
