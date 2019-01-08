using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Internal;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.IO;
using System.Text;

namespace Web.Application.Lib
{
    public class WebTools
    {
        public static string Get(HttpContext context, string name)
        {
            string value = null;

            if (context.Request.Query.ContainsKey(name))
                value = context.Request.Query[name];

            try
            {
                if (value == null && context.Request.Form.ContainsKey(name))
                    value = context.Request.Form[name];
            }
            catch { }

            try
            {
                if (value == null)
                {
                    string bodyStr = GetBody(context);

                    // convert to json
                    JObject bodyJson = JsonConvert.DeserializeObject<JObject>(bodyStr);
                    value = bodyJson[name].ToString();
                }
            }
            catch { }

            return value;
        }

        public static string GetBody(HttpContext context)
        {
            string bodyStr;
            context.Request.EnableRewind();
            context.Request.Body.Position = 0;

            // Arguments: Stream, Encoding, detect encoding, buffer size 
            // AND, the most important: keep stream opened
            using (StreamReader reader
                      = new StreamReader(context.Request.Body, Encoding.UTF8, true, 1024, true))
            {
                bodyStr = reader.ReadToEnd();
            }

            // Rewind, so the core is not lost when it looks the body for the request
            context.Request.Body.Position = 0;

            return bodyStr;
        }

        public static string[] GetArray(HttpContext context, string name)
        {
            string[] values = null;

            if (context.Request.Query.ContainsKey(name))
                values = context.Request.Query[name].ToArray();

            try
            {
                if (values == null && context.Request.Form.ContainsKey(name))
                    values = context.Request.Form[name].ToArray();
            }
            catch { }

            try
            {
                if (values == null)
                {
                    // convert to json
                    JObject bodyJson = JsonConvert.DeserializeObject<JObject>(GetBody(context));
                    values = bodyJson[name].ToObject<string[]>();
                }
            }
            catch (Exception e)
            {
                var i = e;
            }

            return values;
        }

        public static string GetNavigationId(HttpContext context)
        {
            string navigation_id = null;

            if( context.Request.Headers.ContainsKey("X-App-Key"))
                navigation_id = $"{context.Request.Headers["X-App-Key"]}";
            else if(context.Request.Cookies.ContainsKey("X-App-Key"))
                navigation_id = $"{context.Request.Cookies["X-App-Key"]}";
            else if(context.Request.Query.ContainsKey("X-App-Key"))
                navigation_id = $"{context.Request.Query["X-App-Key"]}";

            return navigation_id;
        }

    }
}
