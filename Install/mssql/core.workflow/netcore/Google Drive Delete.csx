// Parse Configuration
string configuration = Inputs.Get("Configuration")?.ToString();
if (string.IsNullOrEmpty(configuration))
    return "No Configuration Specified.";

// Access to drive
IDrive drive = (IDrive)serviceProvider.GetService(typeof(IDrive));
drive.Connect(configuration);

// Get File
IWebToolsService web = (IWebToolsService)serviceProvider.GetService(typeof(IWebToolsService));
string id = web.Get("id");

JsonConvert.SerializeObject(drive.Delete(id))