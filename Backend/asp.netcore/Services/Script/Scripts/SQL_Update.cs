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
    public class SQL_Update
    {
        public static object Run(
            HttpContext context
            , string configuration
            , IList<object> dataservices
            )
        {
            if (string.IsNullOrEmpty(configuration))
                return new { error = "No configuration specified." };

            JObject config = JsonConvert.DeserializeObject<JObject>(configuration);
            string table = $"{config["table"]}";
            if (string.IsNullOrEmpty(table)) return new { error = "No table Specified." };

            string idField = config["id"]?.ToString();
            if (string.IsNullOrEmpty(idField)) return new { error = "No id field Specified." };
                        
            // Retrieve DataService            
            if (dataservices == null || dataservices.Count == 0) return new { error = "Data Services not provided" };
            SQL db = (SQL)dataservices.FirstOrDefault();
            if (db == null) return new { error = "Data Service not provided" };

            // Form document
            var data = JsonConvert.DeserializeObject<JObject>(WebTools.GetBody(context));

            // Complete external relationships
            var externals = (JArray)config["externals"];
            if (externals != null)
                foreach (var external in externals)
                {
                    var extTable = $"{external["table"]}";
                    var extIdField = $"{external["id"]}";
                    var mapping = external["mapping"];
                    var relationships = (JArray)external["relationships"];

                    if (mapping != null)
                    {
                        // for each value create new record on external
                        var source = (JArray)data[$"{mapping["source"]}"];
                        var sourceKey = $"{mapping["sourceKey"]}";

                        // fetch existing records
                        IList<string> where = new List<string>();
                        if (relationships != null)
                            foreach (var relationship in relationships)
                                where.Add($"{relationship["target"]} = {data[$"{relationship["source"]}"]}");

                        try
                        {
                            var existingRecordIds = db
                            .Query($"SELECT {extIdField} FROM {extTable} WHERE {string.Join(" AND ", where)}")
                            .Select(x => $"{x[extIdField]}");

                            // delete from existingRecords
                            var sourceRecordIds = source.Select(x => $"{x[sourceKey]}");
                            var tobeDeleteIds = existingRecordIds.Except(sourceRecordIds);
                            foreach (var item in tobeDeleteIds)
                                SQL_Delete.Delete(db, extTable, item, extIdField);

                        }
                        catch { }


                        foreach (var item in source)
                        {
                            // new record
                            var record = new Dictionary<string, object>();

                            // fill up the record with foreign key relationship
                            if (relationships != null)
                                foreach (var relationship in relationships)
                                    record[$"{relationship["target"]}"] = $"{data[$"{relationship["source"]}"]}";

                            // fill up the mapping value
                            var type = $"{mapping["type"]}";
                            if( type == "object" )
                            {
                                var targets = (JArray)mapping["targets"];
                                if(targets != null )
                                    foreach(var target in targets)
                                        record[$"{target["target"]}"] = $"{item[$"{target["source"]}"]}";
                            }
                            
                            // find the key                            
                            if (sourceKey != null && item[sourceKey] != null)
                            {
                                // update 
                                record[extIdField] = $"{item[sourceKey]}"; 
                                Update(db, extTable, record, extIdField);
                            }             
                            else
                            {
                                // insert
                                SQL_Insert.Insert(db, extTable, record, extIdField);
                            }                           
                        
                        }
                    }

                    
                }

            // Exclude data
            var excludeFields = (config["excludeFields"] as JArray)?.ToObject<string[]>();
            if (excludeFields != null)
                foreach (var excludeField in excludeFields)
                    data.Remove(excludeField);

            // set default fields
            var updatedData = SetDefaults(context, config, data);

            // Update
            var doc_id = Update(db, table, updatedData, idField);

            // Return Result
            return new { _id = data[idField] };
        }

        public static IDictionary<string, object> SetDefaults(
            HttpContext context
            , JObject config
            , JObject data            
            )
        {
            JArray defaults = (JArray)config["defaults"];
            if (defaults != null)
            {
                foreach (var filter in defaults)
                {
                    string filterType = $"{filter["type"]}";
                    switch (filterType)
                    {
                        case "headers":
                            {
                                string key = $"{filter["key"]}";
                                string column = $"{filter["column"]}";

                                if (context.Request.Headers.ContainsKey(key))
                                    data[column] = $"{context.Request.Headers[key]}";
                            }
                            break;
                        case "now":
                            {
                                string column = $"{filter["column"]}";
                                data[column] = DateTime.Now;
                            }
                            break;
                    }
                }
            }

            // convert to date field
            var dataDict = data.ToObject<IDictionary<string, object>>();
            foreach (var entry in dataDict)
                if (entry.Key.EndsWith("_date"))
                    data[entry.Key] = DateTime.Parse($"{data[entry.Key]}");
                        
            return dataDict;
        }

        // Upsert
        public static object Update(
            SQL db
            , string table
            , string doc
            , string idField
            )
        {
            if (string.IsNullOrEmpty(table)) return null;
            if (string.IsNullOrEmpty(idField)) return null;

            IDictionary<string, object> docDict =
                JsonConvert.DeserializeObject<IDictionary<string, object>>(doc);
            Update(db, table, docDict, idField);

            return null;
        }

        public static object Update(
            SQL db
            , string table
            , IDictionary<string, object> doc
            , string idField
            )
        {
            if (string.IsNullOrEmpty(table)) return null;
            if (string.IsNullOrEmpty(idField)) return null;

            //  see if the document has id
            if (doc.ContainsKey(idField) == false) return null;

            string sets = string.Join(", ", doc.Where(item => item.Key != idField).Select(item => $"{item.Key} = @{item.Key}"));
            string query = $"UPDATE {table} SET {sets} WHERE {idField} = @{idField}; SELECT SCOPE_IDENTITY();";

            return db.Execute(query, doc); ;
        }

    }
}
