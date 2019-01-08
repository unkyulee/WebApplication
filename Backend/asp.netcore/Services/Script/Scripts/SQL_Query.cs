using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using Web.Application.Lib;
using Web.Application.Services.DB;

namespace Service.Script.Scripts
{
    class SQL_Query
    {
        public static object Run(
            HttpContext context
            , string configuration
            , IList<object> dataservices
            )
        {
            // Retrieve DataService
            if (dataservices == null || dataservices.Count == 0)
                return new { error = "Data Services not provided" };
            SQL db = (SQL)dataservices.FirstOrDefault();
            if (db == null)
                return new { error = "Data Service not provided" };

            // Query
            var query = WebTools.Get(context, "query");
            if( string.IsNullOrEmpty(query) == false)
            {
                var result = db.Query(query);

                // Return Result
                return JsonConvert.SerializeObject(result);
            }

            return new { error = "query not specified"};

        }
    }
}
