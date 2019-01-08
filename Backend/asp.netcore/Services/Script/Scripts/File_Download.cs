using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Collections.Generic;
using System.IO;
using Web.Application.Lib;

namespace Service.Script.Scripts
{
    class File_Download
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
            string folder = $"{config["folder"]}";
            if (string.IsNullOrEmpty(folder) == true)
                return new { error = "No folder specified." };

            // Get filepath
            string filepath = Path.Combine(folder, WebTools.Get(context, "filepath"));
            if (string.IsNullOrEmpty(filepath) == true)
                return new { error = "No filepath specified" };

            // Get File
            context.Response.Headers["Content-Disposition"] = $"inline;FileName={Path.GetFileName(filepath)}";

            using (MemoryStream ms = new MemoryStream())
            using (FileStream file = new FileStream(filepath, FileMode.Open, FileAccess.Read))
            {
                byte[] bytes = new byte[file.Length];
                file.Read(bytes, 0, (int)file.Length);
                ms.Write(bytes, 0, (int)file.Length);

                return ms.ToArray();
            }

        }

    }
}
