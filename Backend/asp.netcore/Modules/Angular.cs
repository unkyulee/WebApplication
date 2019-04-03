using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Web.Application.Lib;
using Web.Application.Services.DB;
using Web.Appliction.Lib;

namespace Web.Application.Modules
{
    public class Angular : IModule

    {
        public string Authenticated(HttpContext context)
        {
            // parameters
            var db = (SQL)context.Items["db"];
            var navigation = (IDictionary<string, object>)context.Items["navigation"];

            // get angular navigation
            var angular_navigation = new List<IDictionary<string, object>>();
            var param = new Dictionary<string, object>();
            param["navigation_id"] = navigation.Get("_id");
            var navigations = db.Query($@"SELECT * FROM angular_navigation WHERE navigation_id=@navigation_id", param);
            foreach (var nav in navigations)
            {
                var content = JsonConvert.DeserializeObject<IDictionary<string, object>>($"{nav["content"]}");
                content["_id"] = nav["_id"];
                content["navigation_id"] = $"{navigation.Get("_id")}";

                angular_navigation.Add(content);
            }

            // get angular ui
            IDictionary<string, object> angular_ui = new Dictionary<string, object>();

            // fetch angular ui
            // get all uiElementIds from angular_navigations
            JArray jsonAngNavs = JArray.Parse(
                JsonConvert.SerializeObject(angular_navigation)
            );

            // retrieve all matching uiElements and load it
            var uiElements = jsonAngNavs.SelectTokens("$..uiElementIds");
            List<string> ids = new List<string>();
            foreach (var uiElementIds in uiElements)
                foreach (var uiElementId in uiElementIds)
                    ids.Add($"{uiElementId}");

            var angular_uis = db.Query($@"SELECT * FROM angular_ui WHERE _id IN ({string.Join(",", ids.ToArray())})");
            foreach (var ui in angular_uis)
            {
                string content = $"{ui["content"]}";
                content = StringUtils.MultilineToSingle(content);
                angular_ui[$"{ui["_id"]}"] = JsonConvert.DeserializeObject(content);
            }

            return JsonConvert.SerializeObject(new
            {
                angular_navigation,
                angular_ui
            });
        }

        public Task<string> Process(HttpContext context)
        {
            string result = null;

            // parameters
            string WebRootPath = $"{context.Items["WebRootPath"]}";
            var navigation = (IDictionary<string, object>)context.Items["navigation"];

            // get relative path
            string navigationPath = navigation.Get("url")?.ToString();
            var regex = new Regex(Regex.Escape(navigationPath));
            string relativePath = regex.Replace($"{context.Request.Path}", "", 1);

            // check if the file exists in wwwroot
            relativePath = relativePath.Replace('/', Path.DirectorySeparatorChar);
            string filepath = Path.Combine(WebRootPath, relativePath);
            if (File.Exists(filepath))
                result = File.ReadAllText(filepath);
            
            // check if it's index.js
            else if (context.Request.Path.Value.Split("/").Last() == "index.js")
                result = IndexJS(context);
             
            // otherwise return index.html
            else
                result = IndexHtml(context);

            return Task.FromResult(result);
        }

        private string IndexJS(HttpContext context)
        {
            var navigation = (IDictionary<string, object>)context.Items["navigation"];
            var config = JsonConvert.DeserializeObject<IDictionary<string, object>>($"{navigation["content"]}");

            // calculate basePath
            config["rest"] = $"{context.Request.Scheme}://{context.Request.Host}{context.Request.PathBase}";
            config["auth"] = $"{context.Request.Scheme}://{context.Request.Host}{context.Request.PathBase}{navigation.Get("url")}";
            
            return $@"window.__CONFIG__ = {JsonConvert.SerializeObject(config)}";
        }

        private string IndexHtml(HttpContext context)
        {
            string result = string.Empty;

            // read index html
            string WebRootPath = $"{context.Items["WebRootPath"]}";
            string filepath = Path.Combine(WebRootPath, "index.html");
            result = File.ReadAllText(filepath);

            // get navigation info
            var navigation = (IDictionary<string, object>)context.Items["navigation"];

            // render html
            var basePath = $"{context.Request.PathBase}{navigation.Get("url")}";
            if (basePath == "/") basePath = "";
            
            result = result
                .Replace("@title", navigation.Get("name")?.ToString())
                .Replace("@base_href", $@"<base href='{basePath}'>")
                .Replace("@path", $@"{basePath}")
                ;
            return result;
        }
    }
}
