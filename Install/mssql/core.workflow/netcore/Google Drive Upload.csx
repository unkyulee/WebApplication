// Parse Configuration
string configuration = Inputs.Get("Configuration")?.ToString();
if (string.IsNullOrEmpty(configuration))
    return "No Configuration Specified.";

JObject config = JsonConvert.DeserializeObject<JObject>(configuration);

// Access to drive
IDrive drive = (IDrive)serviceProvider.GetService(typeof(IDrive));
drive.Connect(configuration);

// Get File
IWebToolsService web = (IWebToolsService)serviceProvider.GetService(typeof(IWebToolsService));
var files = web.GetFiles();
IList<string> result = new List<string>();
foreach (var file in files)
{
    string id = drive.Create(
        file.FileName
        , config["folder"].ToString()
        , file.OpenReadStream()
    );
    result.Add(id);
}

JsonConvert.SerializeObject(result)