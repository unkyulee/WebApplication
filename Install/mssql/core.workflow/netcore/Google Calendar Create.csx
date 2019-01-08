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
var navigation = db.Get("core.navigation", navigation_id);
var google_info = (IDictionary<string, object>)navigation.Get("google");
var config = db.Get("core.config", navigation_id);

//
var client_id = google_info.Get("client_id").ToString();
var client_secret = config.Get("google_client_secret").ToString();
var scopes = google_info.Get("scope").ToString().Split(" ");

// user info
IWebToolsService web = (IWebToolsService)serviceProvider.GetService(typeof(IWebToolsService));
if (web == null) return JsonConvert.SerializeObject("Not able to retrieve IWebToolsService");
var users = web.GetArray("attendees");
if (users == null) return JsonConvert.SerializeObject("users doesn't exist");
foreach (var user_id in users)
{
    var user = db.Get("core.user", user_id);
    if (user == null) return JsonConvert.SerializeObject("user doesn't exists");

    // download profile information from Google
    // 
    string[] Scopes = { CalendarService.Scope.CalendarReadonly };
    var token = new TokenResponse { RefreshToken = user.Get("refresh_token").ToString() };
    var credential = new UserCredential(
        new AuthorizationCodeFlow(
            new GoogleAuthorizationCodeFlow.Initializer
            {
                ClientSecrets = new ClientSecrets
                {
                    ClientId = client_id,
                    ClientSecret = client_secret
                }
                , Scopes = Scopes
            }            
        )
        , user.Get("password").ToString()
        , token
    );

    // let's use credentials to use google calendar
    // Create Google Calendar API service.
    var service = new CalendarService(new BaseClientService.Initializer()
    {
        HttpClientInitializer = credential,
        ApplicationName = "DM"
    });
    
    // Define parameters of request.
    Event newEvent = new Event()
    {        
        Summary = web.Get("summary"),
        Location = web.Get("location"),
        Description = web.Get("description"),
        Start = new EventDateTime() {
            DateTime = DateTime.Parse(web.Get("start")).ToLocalTime()
        },
        End = new EventDateTime() {
            DateTime = DateTime.Parse(web.Get("end")).ToLocalTime()
        },        
        Attendees = new EventAttendee[] { new EventAttendee() { Email = user.Get("email").ToString() } }        
    };
        
    string event_id = web.Get("event_id");
    if(string.IsNullOrEmpty(event_id) == false)
    {
        // update event
        EventsResource.UpdateRequest request = service.Events.Update(newEvent, "primary", event_id);
        Event updatedEvent = request.Execute();
        if(updatedEvent != null)
            return JsonConvert.SerializeObject(updatedEvent);
    }
    else
    {
        // create events.    
        EventsResource.InsertRequest request = service.Events.Insert(newEvent, "primary");
        Event createdEvent = request.Execute();

        if (createdEvent != null)
            return JsonConvert.SerializeObject(createdEvent);
    }   
    
}
