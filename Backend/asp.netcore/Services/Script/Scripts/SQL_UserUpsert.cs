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
    class SQL_UserUpsert
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
            string idField = $"{config["id"]}"; if (string.IsNullOrEmpty(idField) == true) return new { error = "No id field specified." };

            // Get Navigation ID
            string navigation_id = context.Request.Headers["X-App-Key"];
            if (string.IsNullOrEmpty(navigation_id)) return new { error = "No X-App-Key specified" };

            // IWebToolsService
            var data = JsonConvert.DeserializeObject<JObject>(WebTools.GetBody(context));
            data["navigation_id"] = navigation_id;

            // Get Group ID
            string[] group_ids = data["group_id"]?.ToObject<string[]>();
            if (group_ids == null || group_ids.Length == 0)
                return JsonConvert.SerializeObject(new { error = "No Group Specified." });

            // Retrieve DataService            
            if (dataservices == null || dataservices.Count == 0) return new { error = "Data Services not provided" };
            SQL db = (SQL)dataservices.FirstOrDefault();
            if (db == null) return new { error = "Data Service not provided" };

            // data validation - id and password is mandatory 
            if (string.IsNullOrEmpty($"{data["id"]}") == true) return new { error = "id is mandatory field" };

            // if _id exists - Is it existing user?
            if (data["_id"] != null)
            {
                // Find Item
                string sql = $@"SELECT * FROM core_user WHERE _id=@_id";
                var param = new Dictionary<string, object>();
                param["_id"] = $"{data["_id"]}";

                var results = db.Query(sql, param);
                if (results != null && results.Count() > 0)
                {
                    // account exists
                    var user = results.First();

                    // check if the password matches
                    if (data["password"] != null && $"{user["password"]}" != $"{data["password"]}")
                        if (SecurePasswordHasher.Verify($"{data["password"]}", $"{user["password"]}") == false)
                            return new { error = "password doesn't match" };

                    // update the password
                    if (data["password"] != null) data["password"] = SecurePasswordHasher.Hash($"{data["password"]}");

                    // Exclude data
                    var excludeFields = (config["excludeFields"] as JArray)?.ToObject<string[]>();
                    if (excludeFields != null)
                        foreach (var excludeField in excludeFields)
                            data.Remove(excludeField);

                    var updatedData = SQL_Update.SetDefaults(data.ToObject<IDictionary<string, object>>(), navigation_id);

                    // update user
                    SQL_Update.Update(db, table, updatedData, idField);

                    // update group
                    UpdateGroup(db, navigation_id, group_ids, $"{data["_id"]}");

                    return new { _id = data["_id"] };
                }
            }


            // new user creation
            else
            {
                // check if the user with same id already exists
                string sql = $@"SELECT * FROM core_user WHERE id=@id AND navigation_id=@navigation_id";
                var param = new Dictionary<string, object>();
                param["id"] = $"{data["id"]}";
                param["navigation_id"] = navigation_id;

                var results = db.Query(sql, param);
                if (results != null && results.Count() > 0) return new { error = "same id already exists" };

                // create new user
                data["password"] = SecurePasswordHasher.Hash($"{data["password"]}");
                var updatedData = SQL_Update.SetDefaults(data.ToObject<IDictionary<string, object>>(), navigation_id);
                
                // Exclude data
                var excludeFields = (config["excludeFields"] as JArray)?.ToObject<string[]>();
                if (excludeFields != null)
                    foreach (var excludeField in excludeFields)
                        updatedData.Remove(excludeField);

                // update user
                var insertedId = SQL_Insert.Insert(db, table, updatedData, idField);

                // update group
                UpdateGroup(db, navigation_id, group_ids, $"{insertedId}");

                return new { _id = insertedId };
            }
            return null;
        }
        
        private static void UpdateGroup(SQL db, string navigation_id, string[] groupd_ids, string user_id)
        {
            // delete the user from all the group
            db.Query($"DELETE FROM core_group_user WHERE user_id={user_id}");

            // then add to the specified group
            foreach(string group_id in groupd_ids)            
                db.Query($"INSERT INTO core_group_user (group_id, user_id) VALUES ({group_id}, {user_id})");            
        }

        
    }
}
