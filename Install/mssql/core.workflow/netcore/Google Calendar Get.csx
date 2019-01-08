// Retrieve DataService
IList<IDataService> DataServices = (IList<IDataService>)Inputs.Get("DataServices");
if (DataServices == null) return JsonConvert.SerializeObject("Data Services not provided");
IDataService db = DataServices.FirstOrDefault();
if (db == null) return JsonConvert.SerializeObject("Data Service not provided");
db.Connect();

// Get Navigation ID
IHttpContextAccessor context = (IHttpContextAccessor)serviceProvider.GetService(typeof(IHttpContextAccessor));
string navigation_id = context.HttpContext.Request.Headers["X-App-Key"];
if (string.IsNullOrEmpty(navigation_id))
    return JsonConvert.SerializeObject("No X-App-Key specified");

// get google info            
var navigation = db.GetNavigationById(navigation_id);
var google_info = (IDictionary<string, object>)navigation.Get("google");
var config = db.GetConfig(navigation_id);

//
var client_id = google_info.Get("client_id").ToString();
var client_secret = config.Get("google_client_secret").ToString();
var scopes = google_info.Get("scope").ToString().Split(" ");

// user info
IWebToolsService web = (IWebToolsService)serviceProvider.GetService(typeof(IWebToolsService));
if (web == null) return JsonConvert.SerializeObject("Not able to retrieve IWebToolsService");
var users = web.GetArray("users");
if (users == null) return JsonConvert.SerializeObject("users doesn't exist");
foreach(var user_id in users)
{
    var user = db.Get("core.user", user_id);
    if (user == null) return JsonConvert.SerializeObject("user doesn't exists");

    // download profile information from Google
    // 
    string[] Scopes = { CalendarService.Scope.Calendar };
    AuthorizationCodeFlow googleAuth = new AuthorizationCodeFlow(
        new GoogleAuthorizationCodeFlow.Initializer
        {
            ClientSecrets = new ClientSecrets
            {
                ClientId = client_id,
                ClientSecret = client_secret
            }            
        },
        Scopes
    );

    TokenResponse r = googleAuth.RefreshTokenAsync(user_id, refresh_token, CancellationToken.None).Result;
    UserCredential u = new UserCredential(googleAuth, user.Get("id").ToString(), response);
}

