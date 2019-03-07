using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using System.Xml;
using Web.Application.Lib;

namespace Service.Script.Scripts
{
    class REST_Request
    {
        public static async Task<object> Run(
            HttpContext context
            , string configuration
            , IList<object> dataservices
            )
        {
            object result = null;

            // Get Configuration
            if (string.IsNullOrEmpty(configuration))
                return new { error = "No configuration specified." };
            configuration = Tools.PreProcess(configuration);
            JObject config = JsonConvert.DeserializeObject<JObject>(configuration);

            // check parameters
            string url = $"{config["url"]}";
            if (string.IsNullOrEmpty(url) == true)
                return new { error = "No url specified." };

            // send request
            using (HttpClient client = new HttpClient())
            {
                // set header
                if (config["headers"] != null)
                {
                    JArray headers = (JArray)config["headers"];
                    foreach (var header in headers.Children<JObject>())
                    {
                        foreach (JProperty prop in header.Properties())
                        {
                            client.DefaultRequestHeaders.Add(prop.Name, $"{prop.Value}");
                        }
                    }
                }

                // Process Credentials
                if (config["basic"] != null)
                {
                    var auth = (JObject)config["basic"];
                    client.DefaultRequestHeaders.Authorization =
                        new AuthenticationHeaderValue("Basic", Convert.ToBase64String(
                            Encoding.ASCII.GetBytes($"{auth["id"]}:{auth["password"]}")));
                }

                // Process content
                var body = $"{config["body"]}";
                var data = JsonConvert.DeserializeObject<IDictionary<string, object>>(WebTools.GetBody(context));
                foreach(var key in data.Keys)
                {
                    string value = $"{data[key]}";
                    // convert key -> value
                    body.Replace($"@{key}", value);
                }

                // Send the request
                if ($"{config["method"]}" == "POST")
                {
                    var content = new StringContent(body);
                    if (config["contentType"] != null)
                        content.Headers.ContentType = new MediaTypeHeaderValue($"{config["contentType"]}");
                    var response = await client.PostAsync(url, content);
                    object responseContent = await response.Content.ReadAsStringAsync();

                    // convert the response content
                    if($"{config["convert"]}" == "xml")
                    {
                        XmlDocument doc = new XmlDocument();
                        doc.LoadXml($"{responseContent}");
                        responseContent =JsonConvert.DeserializeObject(JsonConvert.SerializeXmlNode(doc));
                    }

                    // see if to include the request
                    object request = null;
                    if($"{config["includeRequest"]}" == "True")
                    {
                        if ($"{config["convert"]}" == "xml")
                        {
                            XmlDocument doc = new XmlDocument();
                            doc.LoadXml(body);
                            request = JsonConvert.DeserializeObject(JsonConvert.SerializeXmlNode(doc));
                        }
                        else
                        {
                            request = body;
                        }                        
                    }

                    result = new
                    {
                        Status = response.StatusCode,
                        Response = responseContent,
                        Request = request
                    };
                }
            }

            return result;

        }

    }
}
