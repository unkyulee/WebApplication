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
    public class SQL_Delete
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
                        
            string table = $"{config["table"]}";
            if (string.IsNullOrEmpty(table)) return new { error = "No table Specified." };
                       
            string idField = config["id"]?.ToString();            
            if (string.IsNullOrEmpty(idField)) return new { error = "No idField Specified." };

            // Get Navigation ID
            string navigation_id = context.Request.Headers["X-App-Key"];
            if (string.IsNullOrEmpty(navigation_id)) return new { error = "No X-App-Key specified" };

            // Retrieve DataService            
            if (dataservices == null || dataservices.Count == 0) return new { error = "Data Services not provided" };
            SQL db = (SQL)dataservices.FirstOrDefault();
            if (db == null) return new { error = "Data Service not provided" };
            
            // Form document
            string id = WebTools.Get(context, idField);

            // check if the record exists
            var param = new Dictionary<string, object>();
            param["id"] = id;
            param["navigation_id"] = navigation_id;
            string sql = $"SELECT * FROM {table} WHERE {idField}=@id AND navigation_id=@navigation_id";
            // check if admin             
            if (config["admin"] != null && config["admin"].ToObject<bool>() == true)            
                sql = $"SELECT * FROM {table} WHERE {idField}=@id";            

            var results = db.Query(sql, param);
            if( results != null && results.Count() == 1 )
            {                
                // delete
                return new { result = Delete(db, table, id, idField) };
            }

            return new { error = "no record found" };
        }

        public static bool Delete(SQL db, string table, string id, string idField)
        {
            if (string.IsNullOrEmpty(table)) return false;
            if (string.IsNullOrEmpty(id)) return false;
            if (string.IsNullOrEmpty(idField)) return false;

            string query = $"DELETE FROM {table} WHERE {idField} = @id";
            IDictionary<string, object> param = new Dictionary<string, object>();
            param.Add("id", id);

            db.Execute(query, param);

            return true;
        }

    }
}
