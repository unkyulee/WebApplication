using FirebirdSql.Data.FirebirdClient;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.IO;
using System.Runtime.InteropServices.ComTypes;

namespace FirebirdEx
{
    class FireBirdTools
    {
		public void Execute(Config config)
		{
			// connect
			var connectionString = ConnectString(config);
			using (var connection = new FbConnection(connectionString))
			{				
				connection.Open();
				using (var transaction = connection.BeginTransaction())
				{
					using (var command = new FbCommand(
						config.Query,
						connection,
						transaction))
					{
						if (config.Type == "SELECT") Select(command, config);
						
					}
				}
			}
		}

		public void Select(FbCommand command, Config config)
        {
			var table = new List<IDictionary<string, object>>();
			using (var reader = command.ExecuteReader())
			{
				while (reader.Read())
				{
					// extract values
					var values = new object[reader.FieldCount];
					reader.GetValues(values);

					// convert it to dictionary
					var row = new Dictionary<string, object>();
					for (var i = 0; i < reader.FieldCount; i++)
						row[reader.GetName(i)] = values[i];

					// add to table
					table.Add(row);
				}
			}

			// make a json output
			var json = JToken.FromObject(table);
			File.WriteAllText(config.OutputFile, json.ToString());

		}

		public string ConnectString(Config config)
        {
			var connectionString = new FbConnectionStringBuilder
			{
				Database = config.Database,
				ServerType = config.ServerType,
				UserID = config.UserID,
				Password = config.Password,
				ClientLibrary = config.ClientLibrary
			}.ToString();

			return connectionString;
		}

    }
}
