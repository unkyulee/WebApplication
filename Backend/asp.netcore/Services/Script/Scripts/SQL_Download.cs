using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using Web.Application.Lib;
using Web.Application.Services.DB;

namespace Service.Script.Scripts
{
    class SQL_Download
    {
        public static object Run(
            HttpContext context
            , string configuration
            , IList<object> dataservices
            )
        {
            // Get Configuration
            if (string.IsNullOrEmpty(configuration))
                return new { error = "No configuration specified." };
            JObject config = JsonConvert.DeserializeObject<JObject>(configuration);

            // check parameters
            string table = $"{config["table"]}"; if (string.IsNullOrEmpty(table) == true) return new { error = "No table specified." };
            string filepathCol = $"{config["filepath"]}"; if (string.IsNullOrEmpty(filepathCol) == true) return new { error = "No filepath configured." };
            string contentCol = $"{config["content"]}"; if (string.IsNullOrEmpty(contentCol) == true) return new { error = "No content specified." };

            // Get Navigation ID
            string navigation_id = WebTools.GetNavigationId(context);
            if (string.IsNullOrEmpty(navigation_id)) return new { error = "No X-App-Key specified" };

            // Retrieve DataService            
            if (dataservices == null || dataservices.Count == 0) return new { error = "Data Services not provided" };
            SQL db = (SQL)dataservices.FirstOrDefault();
            if (db == null) return new { error = "Data Service not provided" };

            // Get filepath
            string filepath = WebTools.Get(context, "filepath");
            if (string.IsNullOrEmpty(filepath) == true) return new { error = "No filepath specified" };

            // Get File
            context.Response.Headers["Content-Disposition"] = $"inline;FileName={Path.GetFileName(filepath)}";

            // Read file from the SQL table
            using (MemoryStream ms = new MemoryStream())
            {
                var parameters = new Dictionary<string, object>();
                parameters[filepathCol] = filepath;                

                var result = db.Query($@"SELECT {contentCol} FROM {table} WHERE {filepathCol}=@{filepathCol}", parameters);
                if(result != null && result.Count() > 0)                                           
                    return result[0][contentCol];                
            }

            return null;
        }

    }
}
