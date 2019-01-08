// Parse Configuration
string configuration = Inputs.Get("Configuration")?.ToString();
if (string.IsNullOrEmpty(configuration))
    return "No Configuration Specified.";

//
IWebToolsService web = (IWebToolsService)serviceProvider.GetService(typeof(IWebToolsService));

// Access to drive
var driveFactory = (IDriveFactory)serviceProvider.GetService(typeof(IDriveFactory));
IDrive drive = driveFactory.Create("GoogleDrive");
drive.Connect(configuration);

// Get List or Item
object result;
string id = web.Get("id");
if (string.IsNullOrEmpty(id) == false)
{
    // get file info
    var info = drive.GetInfo(id);

    // write header
    IHttpContextAccessor context = (IHttpContextAccessor)serviceProvider.GetService(typeof(IHttpContextAccessor));
    context.HttpContext.Response.Headers.Add(
        "Content-Disposition"
        , $@"inline; filename=""{info["name"]}"""
    );

    // if ID is given then retreive the file
    result = drive.Download(id);
    result = (result as MemoryStream).ToArray();
}
else
{
    var fileList = drive.List(null);
    // display as json
    result = JsonConvert.SerializeObject(
        fileList,
        new JsonSerializerSettings { Formatting = Formatting.Indented }
    );
}

// display result
result

