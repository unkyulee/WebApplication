// Get Navigation ID
IWebToolsService web = (IWebToolsService)serviceProvider.GetService(typeof(IWebToolsService));
IHttpContextAccessor context = (IHttpContextAccessor)serviceProvider.GetService(typeof(IHttpContextAccessor));
string navigation_id = context.HttpContext.Request.Headers["X-App-Key"];
if (string.IsNullOrEmpty(navigation_id))
    // try to get navigation_id
    navigation_id = web.Get("navigation_id");

if (string.IsNullOrEmpty(navigation_id))
    return @"No X-App-Key specified";

// Retrieve DataService
IList<IDataService> DataServices = (IList<IDataService>)Inputs.Get("DataServices");
if (DataServices == null) return "Data Services not provided";
IDataService db = DataServices.FirstOrDefault();
if (db == null) return "Data Service not provided";
db.Connect();

// Get Dropbox Token
var config = db.Get("core.config", navigation_id);
string dropboxToken = config["dropbox_api_key"].ToString();

// Connect to Dropbox
var driveFactory = (IDriveFactory)serviceProvider.GetService(typeof(IDriveFactory));
IDrive drive = driveFactory.Create("Dropbox");
if (drive == null) return "No File driver found";
drive.Connect(dropboxToken);

// Get List or Item
string filepath = web.Get("filepath"); // without beginning slash

object result = null;
if (string.IsNullOrEmpty(filepath) == false)
{
    string filename = filepath.Split("/").Last();
    // write header
    IHttpContextAccessor context = (IHttpContextAccessor)serviceProvider.GetService(typeof(IHttpContextAccessor));
    context.HttpContext.Response.Headers.Add(
        "Content-Disposition"
        , $@"inline; filename=""{filename}"""
    );

    // if ID is given then retreive the file
    result = drive.Download(filepath);
    result = (result as MemoryStream).ToArray();
}

// display result
result

