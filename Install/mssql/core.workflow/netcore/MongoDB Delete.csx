// Parse Configuration
string configuration = Inputs.Get("Configuration")?.ToString();
if (string.IsNullOrEmpty(configuration))
    return "No Configuration Specified.";

JObject config = JsonConvert.DeserializeObject<JObject>(configuration);
string collection = config["collection"]?.ToString();
if (string.IsNullOrEmpty(collection))
    return @"No Collection Specified. { ""collection"" : ""Your collection name here"" }";

// Get Navigation ID
IHttpContextAccessor context = (IHttpContextAccessor)serviceProvider.GetService(typeof(IHttpContextAccessor));
string navigation_id = context.HttpContext.Request.Headers["X-App-Key"];
if (string.IsNullOrEmpty(navigation_id))
    return @"No X-App-Key specified";

// IWebToolsService
IWebToolsService web = (IWebToolsService)serviceProvider.GetService(typeof(IWebToolsService));
if (web == null) return "Not able to retrieve IWebToolsService";

// Retrieve DataService
IList<IDataService> DataServices = (IList<IDataService>)Inputs.Get("DataServices");
if (DataServices == null) return "Data Services not provided";
IDataService db = DataServices.FirstOrDefault();
if (db == null) return "Data Service not provided";
db.Connect();


object result = null;

// Find Item
if ( string.IsNullOrEmpty(web.Get("_id")) == false )
{
    string filter = $"{{ $and: [ {{ 'navigation_id' : '{navigation_id}' }}, {{ '_id' : ObjectId('{web.Get("_id")}') }} ] }}";
    var filteredItems = db.List(collection, filter, null, out _);

    // Send Query    
    if (filteredItems.Count > 0) result = db.Delete(collection, web.Get("_id"));
}

else if (string.IsNullOrEmpty(web.Get("_query")) == false)
{
    string filter = $"{{ $and: [ {{ 'navigation_id' : '{navigation_id}' }}, {web.Get("_query")} ] }}";
    var filteredItems = db.List(collection, filter, null, out _);

    // Send Query    
    if (filteredItems.Count > 0) result = db.DeleteMultiple(collection, web.Get("_query"));
}
    

// Return Result
if (result == null) return "No Results";
JsonConvert.SerializeObject(result, new JsonSerializerSettings { Formatting = Formatting.Indented })



