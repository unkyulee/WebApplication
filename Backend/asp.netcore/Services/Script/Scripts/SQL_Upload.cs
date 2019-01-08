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
    class SQL_Upload
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
            string uploadFolder = WebTools.Get(context, "folder");
            if (string.IsNullOrEmpty(uploadFolder) == true) return new { error = "No folder specified" };

            // Get File
            IList<string> result = new List<string>();
            var files = context.Request.Form.Files;
            foreach (var file in files)
            {
                var parameters = new Dictionary<string, object>();
                parameters[filepathCol] = Path.Combine(uploadFolder, file.FileName);
                
                // copy file stream to byte array                                
                using (var uploadStream = file.OpenReadStream())
                {                    
                    uploadStream.Seek(0, SeekOrigin.Begin);
                    using (var reader = new BinaryReader(uploadStream))
                        parameters[contentCol] = reader.ReadBytes((int)uploadStream.Length);

                    // save to SQL
                    db.Execute($@"
                        BEGIN TRAN
                           UPDATE {table} SET {filepathCol} = @{filepathCol}, {contentCol} = @{contentCol}    
                           WHERE {filepathCol} = @{filepathCol}
                           IF @@rowcount = 0
                           BEGIN
                              INSERT INTO {table} ({filepathCol}, {contentCol}) values (@{filepathCol}, @{contentCol})
                           END
                        COMMIT TRAN"
                        , parameters);
                }
                result.Add($"{parameters[filepathCol]}");
            }            

            return JsonConvert.SerializeObject(result);
        }

    }
}
