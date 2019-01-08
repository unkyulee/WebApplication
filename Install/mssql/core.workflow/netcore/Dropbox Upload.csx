// Get Navigation ID
IHttpContextAccessor context = (IHttpContextAccessor)serviceProvider.GetService(typeof(IHttpContextAccessor));
string navigation_id = context.HttpContext.Request.Headers["X-App-Key"];
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
string dropboxToken = config.Get("dropbox_api_key")?.ToString();
string rootFolder = config.Get("folder")?.ToString();
if (string.IsNullOrEmpty(rootFolder) == true) rootFolder = string.Empty;

// Connect to Dropbox
var driveFactory = (IDriveFactory)serviceProvider.GetService(typeof(IDriveFactory));
IDrive drive = driveFactory.Create("Dropbox");
if (drive == null) return "No File driver found";
drive.Connect(dropboxToken);

// Get Folder
IWebToolsService web = (IWebToolsService)serviceProvider.GetService(typeof(IWebToolsService));
string folder = rootFolder + web.Get("folder");
if (string.IsNullOrEmpty(folder) == true)
    return "No folder specified";

// Get File
IList<string> result = new List<string>();
var files = web.GetFiles();
foreach (var file in files)
{
    string id = drive.Create(
        file.FileName
        , folder
        , file.OpenReadStream()
    );
    result.Add(id);
}

JsonConvert.SerializeObject(result)