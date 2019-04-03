using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using Web.Application.Lib;
using Web.Application.Services.DB;
using Web.Appliction.Lib;

namespace Service.Script.Scripts
{
    public class SQL_List
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

            // check if admin 
            bool admin = false;
            if (config["admin"] != null) admin = true;

            // Get Navigation ID
            string navigation_id = context.Request.Headers["X-App-Key"];
            if (string.IsNullOrEmpty(navigation_id)) return new { error = "No X-App-Key specified" };

            // Calculate Pagination
            string page = WebTools.Get(context, "page"); if (string.IsNullOrEmpty(page)) page = "1";
            string size = WebTools.Get(context, "size"); if (string.IsNullOrEmpty(size)) size = "10";
            
            // Query Options - Sort
            var sort = new List<string>();
            if (WebTools.GetArray(context, "_sort")?.Count() > 0)            
                foreach (var sortKey in WebTools.GetArray(context, "_sort"))
                    sort.Add($"{sortKey}");

            if (WebTools.GetArray(context, "_sort_desc")?.Count() > 0)
                foreach (var sortKey in WebTools.GetArray(context, "_sort_desc"))
                    sort.Add($"{sortKey} DESC");

            // Query - Filters
            var where = new List<string>();

            var parameters = new Dictionary<string, object>();

            // get body
            var data = JsonConvert.DeserializeObject<JObject>(WebTools.GetBody(context));
            if (data == null) data = new JObject();

            // get query
            foreach(var key in context.Request.Query.Keys)
                data[key] = new JArray(context.Request.Query[key].ToArray());

            string[] searchFields = config["searchFields"].ToObject<string[]>();
            if (data != null && data.Count > 0)
            {
                foreach (var item in data)
                {
                    string parameterName = item.Key
                        .Replace(".", "_")
                        .Replace("_lte", "")
                        .Replace("_gte", "")
                        .Replace("_lt", "")
                        .Replace("_gt", "")
                        ;

                    if (item.Key == "page") continue;
                    else if (item.Key == "size") continue;
                    else if (item.Key == "_export") continue;
                    else if (item.Key == "_aggregation") continue;
                    else if (item.Key == "_sort") continue;
                    else if (item.Key == "_sort_desc") continue;

                    // search keyword
                    else if (item.Key == "_search")
                    {
                        if(string.IsNullOrEmpty($"{item.Value.FirstOrDefault()}") == false)
                        {
                            IList<string> search = new List<string>();
                            foreach (var searchKey in searchFields)
                                search.Add($"{searchKey} LIKE '%'+@{parameterName}+'%'");
                            where.Add($"({string.Join(" OR ", search)})");

                            parameters[parameterName] = $"{item.Value.FirstOrDefault()}";
                        }                       

                        continue;
                    }   
                    
                    // range filter
                    else if (item.Key.EndsWith("_date_gte"))                    
                        where.Add($"{item.Key.Replace("_gte", "")} >= @{parameterName}");                        
                    
                    else if (item.Key.EndsWith("_date_lte"))                    
                        where.Add($"{item.Key.Replace("_lte", "")} <= @{parameterName}");                        
                    
                    else if (item.Key.EndsWith("_date_gt"))                    
                        where.Add($"{item.Key.Replace("_gt", "")} > @{parameterName}");                        
                    
                    else if (item.Key.EndsWith("_date_lt"))                    
                        where.Add($"{item.Key.Replace("_lt", "")} < @{parameterName}");                                            

                    // otherwise string filter
                    else 
                        foreach (var str in item.Value)                                                                 
                            where.Add($"{item.Key} = @{parameterName}");

                    // add to parameters                    
                    parameters[parameterName] = $"{item.Value.FirstOrDefault()}";
                }
            }

            // Retrieve DataService            
            if (dataservices == null || dataservices.Count == 0)
                return new { error = "Data Services not provided" };
            SQL db = (SQL)dataservices.FirstOrDefault();
            if (db == null)
                return new { error = "Data Service not provided" };
            
            // Add navigation_id filter
            if (admin == false)
            {
                where.Add("navigation_id = @navigation_id");
                parameters["navigation_id"] = navigation_id;
            }

            // get sql list parameters
            string sqlTemplate = $"{config["sql"]}";
            if (string.IsNullOrEmpty(sqlTemplate))
                return new { error = "No sql template specified." };

            var result = List(
                db
                , sqlTemplate
                , config
                , where
                , parameters
                , sort
                , Int64.Parse(size)
                , Int64.Parse(page));

            var total = Count(db, sqlTemplate, where, parameters);
            
            // Return Result
            var pagedResult = new
            {
                page,
                size,
                total,
                data = result
            };
            return JsonConvert.SerializeObject(
                pagedResult,
                new JsonSerializerSettings { Formatting = Formatting.Indented }
            );            
        }

        public static IList<IDictionary<string, object>> List(
            SQL db
            , string sqlTemplate
            , JObject options
            , IList<string> where
            , IDictionary<string, object> parameters
            , IList<string> sort
            , long size
            , long page
            )
        {
            IList<IDictionary<string, object>> result = null;

            // null check
            if (string.IsNullOrEmpty(sqlTemplate)) return null;

            // 
            string id = $"{options.Get("id")}"; if (string.IsNullOrEmpty("id")) return null;
            string fields = $"{options.Get("fields")}"; if (string.IsNullOrEmpty("fields")) return null;

            // Paginate the result                                    
            string RowNumberQuery = $"ROW_NUMBER() OVER (ORDER BY {id}) AS __ROWNUMBER__, {fields}";
            if (sort.Count() > 0) RowNumberQuery = $"ROW_NUMBER() OVER (ORDER BY {string.Join(",", sort)}) AS __ROWNUMBER__, {fields}";

            string sortedQuery = sqlTemplate.Replace("{fields}", RowNumberQuery);
            if (where.Count() > 0)
                sortedQuery = sortedQuery.Replace("{where}", $"WHERE {string.Join(" AND ", where)}");
            else
                sortedQuery = sortedQuery.Replace("{where}", "");

            string paginatedQuery = $@"
                SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;
                WITH _Page AS ( {sortedQuery} )
                SELECT * FROM _Page WHERE 
                __ROWNUMBER__ BETWEEN {(page - 1) * size + 1} AND {page * size}
                ";

            // Exclude Fields            
            List<string> excludeFields = (options.Get("excludeFields") as JArray)?.ToObject<List<string>>();
            if (excludeFields == null) excludeFields = new List<string>();
            excludeFields.Add("__ROWNUMBER__");

            // Run SQL
            result = db.Query(
                paginatedQuery
                , parameters
                , excludeFields.ToArray()
            );

            // For each row run fetch
            JToken fetch = (JToken)options.Get("fetch");
            if (fetch != null)
                foreach (var row in result)
                    Fetch(db, fetch, row);

            // Convert to Json
            string[] jsonFields = (options.Get("jsonFields") as JToken)?.ToObject<string[]>();
            if (jsonFields != null)
                foreach (var row in result)
                    foreach (var jsonField in jsonFields)
                        row[jsonField] = JsonConvert.DeserializeObject<JObject>($"{row[jsonField]}");

            return result;
        }

        private static void Fetch(
            SQL db
            , JToken fetch
            , IDictionary<string, object> row
            )
        {
            // run fetch on each row to add extra data
            JArray operations = (JArray)fetch;
            foreach (JToken operation in operations)
            {
                // run fetch query
                string[] parameters = operation["parameters"].ToObject<string[]>();
                IDictionary<string, object> p = new Dictionary<string, object>();
                foreach (var param in parameters) p[param] = row.Get(param);
                string sql = $"{operation["sql"]}";

                var result = db.Query(sql, p);

                // extract fields to the row
                string type = $"{operation["type"]}";
                if (string.IsNullOrEmpty(type) == true)
                {
                    JArray fields = (JArray)operation["fields"];
                    foreach (JToken field in fields)
                    {
                        IList<object> fetchResult = new List<object>();
                        foreach (var fetchRow in result)
                            fetchResult.Add(fetchRow[$"{field["source"]}"]);
                        // apply fetch result to the target
                        row[$"{field["target"]}"] = fetchResult;
                    }
                }
                else if (type == "object")
                {
                    string key = $"{operation["key"]}";
                    JArray fields = (JArray)operation["fields"];
                    IList<object> fetchResult = new List<object>();
                    foreach (var fetchRow in result)
                    {
                        var item = new Dictionary<string, object>();
                        foreach (JToken field in fields)
                        {
                            // apply fetch result to the target
                            item[$"{field["target"]}"] = fetchRow[$"{field["source"]}"];
                        }
                        fetchResult.Add(item);
                    }

                    // 
                    row[key] = fetchResult;

                }

            }
        }

        public static long Count(
            SQL db
            , string sqlTemplate
            , IList<string> where
            , IDictionary<string, object> parameters
            )
        {
            long total = 0;

            // null check
            if (string.IsNullOrEmpty(sqlTemplate)) return 0;

            string query = sqlTemplate.Replace("{fields}", "COUNT(*) AS CNT");
            if (where.Count() > 0)
                query = query.Replace("{where}", $"WHERE {string.Join(" AND ", where)}");
            else
                query = query.Replace("{where}", "");

            // Run SQL
            var result = db.Query(
                $"SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED; {query}"
                , parameters
            );

            if (result.Count() > 0)
                total = Int64.Parse($"{result[0]["CNT"]}");

            return total;
        }

    }
}
