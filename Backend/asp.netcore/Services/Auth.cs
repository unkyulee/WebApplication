using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using Web.Application.Modules;
using Web.Application.Lib;
using Web.Application.Services.DB;
using Web.Appliction.Lib;

namespace Web.Application.Services
{
    public class Auth
    {
        public static bool CanModuleProcess(HttpContext context)
        {            
            // check if the current module requires authentication
            // if authentication is not required then proceed
            if (RequriresAuthentication(context) == false)
                return true;

            // check if the request is authenticated
            bool authenticated = IsAuthenticated(context);
            if (authenticated == false)
            {
                // if not authenticated then try to authenticate the request
                authenticated = Authenticate(context);
                if (authenticated == false)
                {
                    // clear cookie
                    context.Response.Cookies.Delete("X-App-Key");
                    context.Response.Cookies.Delete("Authorization");

                    // authentication failed
                    context.Response.StatusCode = StatusCodes.Status403Forbidden;
                    return false;
                }
                else
                {
                    // if authentication is successful then return the angular config
                    IModule module = (IModule)context.Items["module"];                    
                    string result = module.Authenticated(context);
                    if (result != null) context.Response.WriteAsync(result);
                    return false;
                }
            }

            // check if the request is authorized
            bool authorized = IsAuthorized(context);
            if (authorized == false)
            {
                // request is not authorized
                context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                return false;
            }

            // check if it is requesting for validate
            if (context.Request.Headers.ContainsKey("Validate"))
            {
                // if authentication is successful then return the angular config
                IModule module = (IModule)context.Items["module"];
                string result = module.Authenticated(context);
                if (result != null) context.Response.WriteAsync(result);
                return false;
            }

            return true;
        }


        // Check if the request requires authentication
        // Phase 1. Download App - does not require authentication
        // Rest of phases requires authentication
        public static bool RequriresAuthentication(
            HttpContext context
        )
        {
            // by default all request requires authentication
            bool needAuth = true;

            // except download app doesn't require authentication      
            IModule module = (IModule)context.Items["module"];
            if (module != null &&
                module.GetType().FullName == "Web.Application.Modules.Angular" &&
                // download request comes with get method, otherwise requires authentication
                context.Request.Method == "GET"
            )
            {
                needAuth = false;
            }

            return needAuth;
        }


        public static bool IsAuthenticated(HttpContext context)
        {
            bool authenticated = false;

            // do the JWT toekn thingy
            string token = null;
            if (context.Request.Headers.ContainsKey("Authorization"))
            {
                token = context.Request.Headers["Authorization"];
                token = token.Replace("Bearer ", "");
            }
                
            // if headers not given check cooikes - only if it is get and file download
            else if (
                context.Request.Cookies.ContainsKey("Authorization") && 
                context.Request.Method == "GET" )
            {
                token = context.Request.Cookies["Authorization"];                
                token = token.Replace("Bearer ", "");
            }

            else if (
                context.Request.Query.ContainsKey("Bearer") &&
                context.Request.Method == "GET" )
            {
                token = context.Request.Query["Bearer"];
            }


            if (string.IsNullOrEmpty(token) == false)
            {
                try
                {
                    // decoded token will be saved as token in the res.locals
                    var decodedToken = JwtTool.Verify(token, $"{context.Items["secret"]}");
                    context.Items["token"] = decodedToken;
                    if( decodedToken != null )
                    {
                        // if authentication is expiring soon then issue a new token
                        // if half of the time is passed then renew
                        var exp = new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc);
                        exp = exp.AddSeconds((Int64)decodedToken["exp"]);

                        if (exp < DateTime.Now.AddDays(-1))
                        {
                            // new token
                            var newToken = JwtTool.CreateToken(
                                context
                                , $"{decodedToken["unique_name"]}"
                                , $"{decodedToken["nameid"]}"
                                , (string[])decodedToken["roles"]
                            );
                        }

                        RefreshHeader(context, token);

                        // authenticated
                        authenticated = true;
                    }                   
                    
                }
                catch
                {
                    authenticated = false;
                }
            }

            return authenticated;
        }

        // Given id and password, authenticate the user
        public static bool Authenticate(HttpContext context)
        {
            bool authenticated = false;

            // get user id and password
            string id = WebTools.Get(context, "id");
            string password = WebTools.Get(context, "password");
            string navigation_id = WebTools.GetNavigationId(context);
            if (string.IsNullOrEmpty(id) == false && string.IsNullOrEmpty(navigation_id) == false)
            {
                // find user with matching id and password
                var db = (SQL)context.Items["db"];
                var param = new Dictionary<string, object>();
                param["id"] = id; param["navigation_id"] = navigation_id;
                var users = db.Query(
                    "SELECT * FROM core_user WHERE id = @id AND navigation_id = @navigation_id"
                    , param);

                if (users != null && users.Count() == 1)
                {
                    var user = users.First();

                    bool valid = false;
                    // if password is DBNull and also empty then pass
                    if (user.Get("password") is DBNull || string.IsNullOrEmpty($"{user.Get("password")}"))
                        valid = true;

                    // Verify the password                    
                    else if (SecurePasswordHasher.Verify(password, $"{user.Get("password")}"))
                        valid = true;

                    if (valid)
                    {
                        // create a new token                        
                        var token = JwtTool.CreateToken(
                            context
                            , $"{user["id"]}"
                            , $"{user["name"]}"
                            , RolesOfUser(context, $"{user["_id"]}")
                        );

                        RefreshHeader(context, token);
                        // is authenticated
                        authenticated = true;
                    }
                }
            }

            return authenticated;
        }


        private static string[] RolesOfUser(HttpContext context, string userDbId)
        {
            var roleids = new Dictionary<string, object>();

            // get groups
            var db = (SQL)context.Items["db"];
            var groups = db.Query($@"
                SELECT DISTINCT G.* 
                FROM core_group G 
	                INNER JOIN core_group_user GU ON GU.group_id = G._id
                WHERE GU.user_id = '{userDbId}'");
            // get roles
            foreach (var group in groups)
            {
                var roles = db.Query($@"
                    SELECT * FROM core_role_group
                    WHERE group_id = '{group["_id"]}'");
                foreach (var role in roles)
                    roleids[$"{role["role_id"]}"] = 1;
            }

            return roleids.Keys.ToArray<string>();
        }

        private static void RefreshHeader(
            HttpContext context
            , string token
            )
        {
            // write header before sending the response
            context.Request.Headers["Authorization"] = $"Bearer {token}";
            context.Response.Headers["Authorization"] = $"Bearer {token}";
            context.Response.Headers["Access-Control-Expose-Headers"] = "Authorization";
            context.Response.Cookies.Append("Authorization", $"Bearer {token}");
        }

        public static bool IsAuthorized(HttpContext context)
        {
            bool authorized = false;

            // get current user
            var payload = (IDictionary<string, object>)context.Items["token"];
            if (payload != null)
            {
                // payload contains roles
                var roles = payload.Get("roles");
                IList<string> roleIds = new List<string>();
                if (roles?.GetType() == typeof(string))
                    roleIds.Add(roles.ToString());

                else if(roles != null)
                    foreach(var role in roles as string[])
                        roleIds.Add(role);                

                // get policy
                IList<string> allowed, not_allowed;
                GetPolicy(context, roleIds, out allowed, out not_allowed);

                try { authorized = IsAllowed(context, allowed, not_allowed); }
                catch { }
            }


            return authorized;
        }

        // populate policy
        private static void GetPolicy(
            HttpContext context
            , IList<string> roles
            , out IList<string> allowed
            , out IList<string> not_allowed
            )
        {

            // 
            allowed = null;
            not_allowed = null;

            // null check
            var db = (SQL)context.Items["db"];
            if (db == null) return;
            if (roles == null) return;

            // collect keys
            ISet<string> allowed_set = new HashSet<string>();
            ISet<string> not_allowed_set = new HashSet<string>();

            foreach (var role_id in roles)
            {
                // load role
                var role = db.Query($@"SELECT * FROM core_role WHERE _id={role_id}").First();

                // add to allowed 
                var policies = db.Query($@"SELECT * FROM core_policy WHERE role_id={role.Get("_id")}");
                foreach (var policy in policies) {
                    if ((bool)policy["type"] == true)
                        allowed_set.Add($"{policy.Get("policy")}");
                    else if ((bool)policy["type"] == false)
                        not_allowed_set.Add($"{policy.Get("policy")}");
                }
            }

            // set output
            allowed = allowed_set.ToList();
            not_allowed = not_allowed_set.ToList();

        }


        private static bool IsAllowed(
            HttpContext context
            , IList<string> allowed
            , IList<string> not_allowed
            )
        {
            bool result = false;

            // set default url if not specified
            string url = context.Request.Path;
            if (string.IsNullOrEmpty(url)) url = "/";

            string method = context.Request.Method.ToLower();

            // is allowed?
            if (allowed != null)
            {
                foreach (var permission in allowed)
                {
                    string permissionUrl = permission.Split(":")[0];
                    string permissionMethod = permission.Split(":")[1];

                    if (SimpleStringMatch.IsMatch(url, permissionUrl) == true
                        && SimpleStringMatch.IsMatch(method, permissionMethod) == true)
                    {
                        result = true;
                        break;
                    }
                }
            }


            // check not allowed
            if (not_allowed != null)
            {
                foreach (var permission in not_allowed)
                {
                    string permissionUrl = permission.Split(":")[0];
                    string permissionMethod = permission.Split(":")[1];

                    if (SimpleStringMatch.IsMatch(url, permissionUrl) == true
                        && SimpleStringMatch.IsMatch(method, permissionMethod) == true)
                    {
                        result = false;
                        break;
                    }
                }
            }

            return result;
        }

    }
}
