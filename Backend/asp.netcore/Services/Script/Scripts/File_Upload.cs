using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.IO;
using Web.Application.Lib;

namespace Service.Script.Scripts
{
    class File_Upload
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
            string folder = $"{config["folder"]}"; if (string.IsNullOrEmpty(folder) == true) return new { error = "No folder specified." };

            // Get Navigation ID
            string navigation_id = WebTools.GetNavigationId(context);
            if (string.IsNullOrEmpty(navigation_id)) return new { error = "No X-App-Key specified" };

            // Get upload folder
            string uploadFolder = Path.Combine(folder, WebTools.Get(context, "folder"));
            if (string.IsNullOrEmpty(uploadFolder) == true) return new { error = "No folder specified" };

            // Get File
            IList<string> result = new List<string>();
            var files = context.Request.Form.Files;
            foreach (var file in files)
            {                
                string uploadPath = Path.Combine(uploadFolder, file.FileName);                
                using (var fileStream = File.Create(uploadPath))
                {
                    var uploadStream = file.OpenReadStream();
                    uploadStream.Seek(0, SeekOrigin.Begin);
                    uploadStream.CopyTo(fileStream);
                }
                result.Add(uploadPath);
            }            

            return JsonConvert.SerializeObject(result);
        }

    }
}
