using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using Web.Application.Lib;
using Web.Application.Services.DB;

namespace Service.Script.Scripts
{
    class SQL_UserChangePassword
    {
        public static object Run(
            HttpContext context
            , string configuration
            , IList<object> dataservices
            )
        {
            // Get Configuration
            if (string.IsNullOrEmpty(configuration)) configuration = "{}";                
            JObject config = JsonConvert.DeserializeObject<JObject>(configuration);

            // check if admin             
            bool admin = false;
            if (config["admin"] != null && config["admin"].ToObject<bool>() == true)            
                admin = true;

            // Get Navigation ID
            string navigation_id = context.Request.Headers["X-App-Key"];
            if (string.IsNullOrEmpty(navigation_id)) return new { error = "No X-App-Key specified" };

            // Retrieve DataService            
            if (dataservices == null || dataservices.Count == 0) return new { error = "Data Services not provided" };
            SQL db = (SQL)dataservices.FirstOrDefault();
            if (db == null) return new { error = "Data Service not provided" };

            // IWebToolsService
            var data = JsonConvert.DeserializeObject<JObject>(WebTools.GetBody(context));

            // error check
            if (data["new_password"] == null) return new { error = "new password missing" };
            if (data["old_password"] == null && !admin) return new { error = "current password missing" };
            if (data["new_password_confirm"] == null && !admin) return new { error = "repeated password missing" };
            if ($"{data["new_password_confirm"]}" != $"{data["new_password"]}" && !admin) return new { error = "new password and repeated password mismatch" };

            // find the user
            // Find Item
            string sql = $@"SELECT * FROM core_user WHERE _id=@_id";
            var param = new Dictionary<string, object>();
            param["_id"] = $"{data["_id"]}";

            var results = db.Query(sql, param);
            if (results != null && results.Count() > 0)
            {
                // account exists
                var user = results.First();

                if (admin == false)
                    // check if the password matches
                    if (SecurePasswordHasher.Verify($"{data["old_password"]}", $"{user["password"]}") == false)
                        return new { error = "password doesn't match" };

                // update password                
                var password = SecurePasswordHasher.Hash($"{data["new_password"]}");                
                
                // update user
                var updatedId = SQL_Update.Update(
                    db
                    , "core_user"
                    , JsonConvert.DeserializeObject<IDictionary<string, object>>(
                        JsonConvert.SerializeObject(new { password, _id = data["_id"]})
                    )
                    , "_id"
                );

                // return result    
                return new { id = data["_id"] };
            }

            return new { error = "not matching user found" };
        }
    }
}
