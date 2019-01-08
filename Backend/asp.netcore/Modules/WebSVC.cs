using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using Web.Application.Interfaces;
using Web.Application.Lib;
using Web.Application.Services;
using Web.Application.Services.DB;
using Web.Appliction.Ext;

namespace Web.Application.Modules
{
    public class WebSVC : IModule
    {
        public string Authenticated(HttpContext context)
        {
            return JsonConvert.SerializeObject(
                new { bearer = context.Response.Headers["Authorization"] }
            );
        }

        public string Process(HttpContext context)
        {
            string result = null;

            // get relative path
            var navigation = (IDictionary<string, object>)context.Items["navigation"];
            string navigationPath = navigation.Get("url")?.ToString();

            // db
            var db = (SQL)context.Items["db"];

            var regex = new Regex(Regex.Escape(navigationPath));
            string[] relativePaths = regex
                .Replace(context.Request.Path.ToString(), "", 1)
                .Split("/");

            // get websvc name            
            string websvcName = string.Empty;
            if (relativePaths.Length > 1)
                websvcName = relativePaths[1];

            // get navigation id
            string navigationId = navigation.Get("_id")?.ToString();

            // load web services
            if (
                string.IsNullOrEmpty(websvcName) == false
                && string.IsNullOrEmpty(navigationId) == false
                )
            {
                var serviceParam = new Dictionary<string, object>();
                serviceParam["navigation_id"] = navigationId;
                serviceParam["api_url"] = websvcName;
                var service = db.Query(
                    @"SELECT * FROM core_websvc WHERE navigation_id=@navigation_id AND api_url=@api_url"
                    , serviceParam
                ).First();
                
                // services exists and provides api for the method
                string method = context.Request.Method.ToLower();
                if (service != null)
                {
                    // load workflow
                    string workflow_id = service.Get($"{method}_workflow")?.ToString();
                    if (string.IsNullOrEmpty(workflow_id) == false)
                    {
                        var workflowParam = new Dictionary<string, object>();
                        workflowParam["_id"] = workflow_id;
                        var workflow = db.Query(
                            @"SELECT * FROM core_workflow WHERE _id=@_id"
                            , workflowParam
                        ).First();
                        if (workflow != null)
                        {
                            // Prepare inputs to the script
                            IDictionary<string, object> Inputs = new Dictionary<string, object>();

                            // load datasources
                            var dataservices = new List<object>();
                            var dsIds = service.GetArray($"{method}_datasource") as object[];
                            foreach (object dsId in dsIds)
                            {
                                if (string.IsNullOrEmpty($"{dsId}") == false)
                                {
                                    // load datasource
                                    var dataserviceParam = new Dictionary<string, object>();
                                    dataserviceParam["_id"] = dsId;
                                    var dataservice = db.Query(
                                        "SELECT * FROM core_dataservice WHERE _id=@_id"
                                        , dataserviceParam).First();

                                    var createdDS = new SQL($"{dataservice.Get("connectionString")}");

                                    // instantiate                             
                                    dataservices.Add(createdDS);
                                }
                            }

                            // produce entire script                                                         
                            object scriptResult = Script.Run(
                                context
                                , $"{workflow?.Get("_id")}"
                                , $"{service.Get($"{method}_configuration")}"
                                , dataservices);

                            // if script result is string
                            if (scriptResult != null && scriptResult.GetType() == typeof(string))
                            {
                                result = scriptResult.ToString();
                                // jsonp                                
                                string callback = WebTools.Get(context, "callback");
                                if (string.IsNullOrEmpty(callback) == false)
                                    result = $"{callback}({result})";
                            }

                            // if script result is anonymous type
                            else if (scriptResult != null && scriptResult.GetType().Name.Contains("AnonymousType"))
                            {
                                // return json serialized format
                                result = JsonConvert.SerializeObject(scriptResult);
                            }

                            // if script result is not string
                            else if (scriptResult != null)
                            {
                                // response with token
                                byte[] byteResult = (byte[])scriptResult;
                                context.Response.Body.WriteAsync(byteResult, 0, byteResult.Length);
                            }

                        }
                    }

                }
            }

            return result;
        }
    }
}
