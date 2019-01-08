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

// Calculate Pagination
IWebToolsService web = (IWebToolsService)serviceProvider.GetService(typeof(IWebToolsService));
if (web == null) return "Not able to retrieve IWebToolsService";
string page = web.Get("page"); if (string.IsNullOrEmpty(page)) page = "1";
string size = web.Get("size"); if (string.IsNullOrEmpty(size)) size = "10";
string aggregation = web.Get("_aggregation"); 

// if excel export then try to get all contents
if (web.Get("_export") == "excel") size = "10000";

// Retrieve DataService
IList<IDataService> DataServices = (IList<IDataService>)Inputs.Get("DataServices");
if (DataServices == null) return "Data Services not provided";
IDataService db = DataServices.FirstOrDefault();
if (db == null) return "Data Service not provided";
db.Connect();

// Sort
IList<KeyValuePair<string, string>> sort = new List<KeyValuePair<string, string>>();

// Query Options - Pagination
IDictionary<string, object> options = new Dictionary<string, object>();
options.Add("page", page);
options.Add("size", size);
options.Add("sort", sort);

// add aggregation if exists
if( string.IsNullOrEmpty(aggregation) == false )
    options.Add("aggregation", aggregation);

// Filters
var values = web.GetAll();
values.Remove("page");
values.Remove("size");
values.Remove("_export");
values.Remove("_aggregation");

string filter = "{}";
StringBuilder builder = new StringBuilder();
builder.Append($"{{ 'navigation_id' : '{navigation_id}' }},"); // add X-App-Key filter

if (values != null && values.Count > 0)
{    
    foreach (var value in values)
    {
        if (value.Key == "_sort")
        {
            foreach (var str in value.Value)
                sort.Add(new KeyValuePair<string, string>("asc", str));
            continue;
        }
        if (value.Key == "_sort_desc")
        {
            foreach (var str in value.Value)
                sort.Add(new KeyValuePair<string, string>("desc", str));
            continue;
        }
        foreach (var str in value.Value)
        {
            builder.Append("{");

            // _id gets ObjectId wrapper
            if (value.Key == "_id")
            {
                builder.Append($" '{value.Key}' : ObjectId('{str}') ");
            }

            // global search
            else if (value.Key == "_search")
            {
                if (string.IsNullOrEmpty(str) == false)
                    builder.Append($@" $text: {{ $search: ""{str}"" }}");
            }

            // range
            else if (value.Key.EndsWith("_date_gte") ) builder.Append($" '{value.Key.Replace("_gte","")}' : {{ $gte: ISODate('{str}') }} ");
            else if (value.Key.EndsWith("_date_gt")) builder.Append($" '{value.Key.Replace("_gt", "")}' : {{ $gt: ISODate('{str}') }} ");
            else if (value.Key.EndsWith("_date_lte")) builder.Append($" '{value.Key.Replace("_lte", "")}' : {{ $lte: ISODate('{str}') }} ");
            else if (value.Key.EndsWith("_date_lt")) builder.Append($" '{value.Key.Replace("_lt", "")}' : {{ $lt: ISODate('{str}') }} ");

            // expression
            else if(value.Key.EndsWith("$")) builder.Append($" '{value.Key.Replace("$", "")}' : {str} ");

            // otherwise, string filter
            else builder.Append($" '{value.Key}' : '{str}' ");

            builder.Append("},");
        }
    }    
}

// make filter string
if (string.IsNullOrEmpty(builder.ToString()) == false)
    filter = $"{{ $and: [{builder.ToString()}] }}";

// Send Query
long total = 0;
var result = db.List(collection, filter, options, out total);
object response = null;

if (web.Get("_export") == "excel")
{
    if (result?.Count == 0)
    {
        result = new List<IDictionary<string, object>>();
        result.Add(new Dictionary<string, object>() { { "Error", "No Data Found" } });
    }


    // Create DataTable
    DataTable dt = new DataTable("export");

    // add row
    foreach (var row in result)
    {
        var newRow = dt.NewRow();
        foreach (string key in row.Keys)
        {
            // add column if not exists
            if (dt.Columns.Contains(key) == false) dt.Columns.Add(key);

            // convert to value            
            if(
                row[key].GetType() == typeof(Int32) ||
                row[key].GetType() == typeof(string) ||
                row[key].GetType() == typeof(DateTime) 
            )
            { 
                newRow[key] = row[key];
            }
            else
            {
                newRow[key] = JsonConvert.SerializeObject(row[key]);
            }
            
        }
            
        dt.Rows.Add(newRow);
    }

    // Excel Export
    var wb = new XLWorkbook();
    wb.Worksheets.Add(dt);

    MemoryStream fs = new MemoryStream();
    wb.SaveAs(fs);
    fs.Seek(0, SeekOrigin.Begin);
    response = fs.ToArray();

}
else
{
    // Return Result
    var pagedResult = new
    {
        page,
        size,
        total,
        filter,
        data = result
    };

    response = JsonConvert.SerializeObject(
        pagedResult,
        new JsonSerializerSettings { Formatting = Formatting.Indented }
    );
}

response