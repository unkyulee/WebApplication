using FirebirdSql.Data.FirebirdClient;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.IO;

namespace FirebirdEx
{
    class FireBirdTools
    {
		JObject config;

		public FireBirdTools(string filepath)
        {
			config = JObject.Parse(File.ReadAllText(filepath));
		}

		public void Execute()
		{
			// prepare the database file - make copy 
			File.Delete(config.GetValue("InputFile").ToString());
			File.Copy(
				config.GetValue("Database").ToString(), 
				config.GetValue("InputFile").ToString()
			);

			// connect
			var connectionString = ConnectString();
			using (var connection = new FbConnection(connectionString))
			{				
				connection.Open();

				JArray Operations = (JArray)config.GetValue("Operations");
				foreach(JObject operation in Operations)
                {	
					using (var transaction = connection.BeginTransaction())
					{					
						using (var command = new FbCommand(
							operation.GetValue("Query").ToString(),
							connection,
							transaction))
						{
							if (operation.GetValue("Type").ToString() == "SELECT")
							{
								var outputfile = operation.GetValue("OutputFile").ToString();
								Select(command, outputfile);
								Console.WriteLine($"SELECT completed - {outputfile}");
							}						
						}					
					}
					
				}

				connection.Close();
			}
		}

		public void Select(FbCommand command, string outputfile)
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
			File.WriteAllText(outputfile, json.ToString());

		}

		public string ConnectString()
        {
			var connectionString = new FbConnectionStringBuilder
			{
				Database = config.GetValue("InputFile").ToString(),
				ServerType = config.GetValue("ServerType").ToString() == "Embedded" ? FbServerType.Embedded : FbServerType.Default,
				UserID = config.GetValue("UserID").ToString(),
				Password = config.GetValue("Password").ToString(),
				ClientLibrary = config.GetValue("ClientLibrary").ToString()
			}.ToString();

			return connectionString;
		}

    }
}
