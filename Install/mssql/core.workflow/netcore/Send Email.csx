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
var config = JObject.FromObject(db.Get("core.config", navigation_id));
if (config == null) return "Config doesn't exist";

// Get Configuration
string SmtpServer = config["smtp_server"]?.ToString();
if (string.IsNullOrEmpty(SmtpServer)) return @"SmtpServer not specified";

string Port = config["smtp_port"]?.ToString();
if (string.IsNullOrEmpty(Port)) return @"Port not specified";

string Username = config["smtp_user_name"]?.ToString();
if (string.IsNullOrEmpty(Username)) return @"Username not specified";

string Password = config["smtp_password"]?.ToString();
if (string.IsNullOrEmpty(Password)) return @"Password not specified";

string From = config["smtp_from"]?.ToString();
if (string.IsNullOrEmpty(From)) return @"From not specified";

// Get notification templates
IWebToolsService web = (IWebToolsService)serviceProvider.GetService(typeof(IWebToolsService));

var data = JsonConvert.DeserializeObject<JObject>(web.GetBody());

// find a template with the matching trigger
var trigger = web.Get("trigger");
var notification_templates = config["notification_templates"];
JToken notification_template = null;
foreach (var t in notification_templates)
{
    if (t["trigger"].ToString() == trigger)
    {
        notification_template = t;
        break;
    }
}       

// Razor Engine
var engine = new RazorLightEngineBuilder().UseMemoryCachingProvider().Build();

// Convert to 
string to = null;
if (notification_template != null && notification_template["to"] != null)
{
    to = engine.CompileRenderAsync(
        Guid.NewGuid().ToString()
        , notification_template["to"].ToString()
        , data).Result;
}
if(web.GetArray("to") != null) to = string.Join(", ", web.GetArray("to"));

// Convert title 
string title = web.Get("title");
if (notification_template != null && notification_template["title"] != null)
{
    title = engine.CompileRenderAsync(
        Guid.NewGuid().ToString()
        , notification_template["title"].ToString()
        , data).Result;
}

// convert body
string body = web.Get("body");
if (notification_template != null && notification_template["body"] != null)
{
    body = engine.CompileRenderAsync(
        Guid.NewGuid().ToString()
        , notification_template["body"].ToString()
        , data).Result;
}

// Form email message
if (string.IsNullOrEmpty(to) == false)
{
    MailMessage mail = new MailMessage();
    mail.From = new MailAddress(From);
    foreach (var t in to.Split(",")) mail.To.Add(t);
    mail.Subject = title;
    mail.Body = body;
    mail.IsBodyHtml = true;

    // Send
    SmtpClient client = new SmtpClient(SmtpServer);
    client.Port = int.Parse(Port);
    client.Credentials = new System.Net.NetworkCredential(Username, Password);
    client.EnableSsl = true;
    client.Send(mail);

}

// Response 
return JsonConvert.SerializeObject(new
{
    to,
    title,
    body
});


