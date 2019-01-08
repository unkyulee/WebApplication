using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.WebUtilities;
using System.Collections.Generic;
using System.Linq;
using Web.Application.Interfaces;
using Web.Application.Modules;
using Web.Application.Services.DB;
using Web.Appliction.Ext;

namespace Web.Application.Services
{
    public class Router
    {
        public static bool PreProcess(HttpContext context)
        {
            if (context.Request.Method == "OPTIONS")
                return false;
            
            // Authorization
            if (context.Request.Headers.ContainsKey("Authorization"))
            {
                context.Response.Headers["Access-Control-Expose-Headers"] = "Authorization";
                context.Response.Headers["Authorization"] = context.Request.Headers["Authorization"];
                context.Response.Cookies.Append("Authorization", context.Request.Headers["Authorization"]);                
            }

            // Authorization Cookie
            if (context.Request.Headers.ContainsKey("X-App-Key"))
            {
                context.Response.Cookies.Append("X-App-Key", context.Request.Headers["X-App-Key"]);
                context.Response.Headers["X-App-Key"] = context.Request.Headers["X-App-Key"];
            }

            // remove auto login if it's already authenticated
            if (context.Request.Query.ContainsKey("autologin") &&
                Auth.IsAuthenticated(context))
            {
                // remove autologin, id, password from the query string and redirect
                var queryParams = new Dictionary<string, string>();
                foreach(var query in context.Request.Query)                
                    if(query.Key != "autologin" && query.Key != "id" && query.Key != "password")
                        queryParams[query.Key] = query.Value;
                
                // redirect without autologin info
                var url = QueryHelpers.AddQueryString($"{context.Request.PathBase}{context.Request.Path}", queryParams);
                context.Response.Redirect(url);
                return false;
            }

            return true;
        }

        public static IDictionary<string, object> ResolveNavigation(HttpContext context)
        {
            IDictionary<string, object> result = null;

            // get DB instance
            var db = (SQL)context.Items["db"];
            if( db != null)
            {
                // get list of navigation                              
                result = db.Query($@"
                    SELECT * FROM core_navigation 
                    WHERE '{context.Request.Path}' LIKE url+'%' 
                    ORDER BY priority DESC").FirstOrDefault();

                // also apply them if applicable
                if (result != null && result.Get("color_primary") != null)
                {
                    // add color to the result
                    result["color"] = new
                    {
                        primary = result.Get("color_primary"),
                        primaryLight = result.Get("color_primaryLight"),
                        primaryDark = result.Get("color_primaryDark"),
                        secondary = result.Get("color_secondary"),
                        secondaryLight = result.Get("color_secondaryLight"),
                        secondaryDark = result.Get("color_secondaryDark"),
                        accent = result.Get("color_accent"),
                        accentLight = result.Get("color_accentLight"),
                        accentDark = result.Get("color_accentDark"),
                        background = result.Get("color_background")
                    };
                }
            }

            return result;
        }

        public static IModule GetModule(string filename)
        {
            IModule result = null;

            // load module information from db            
            switch (filename)
            {
                case "Module.SinglePage.dll":
                    result = new Angular();
                    break;

                case "Module.WebServices.dll":
                    result = new WebSVC();
                    break;
            }

            return result;
        }

    }
}
