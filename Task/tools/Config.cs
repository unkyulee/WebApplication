using FirebirdSql.Data.FirebirdClient;
using Microsoft.VisualBasic.CompilerServices;
using Newtonsoft.Json.Linq;
using System;
using System.IO;

namespace FirebirdEx
{
    class Config
    {
        // connection
        public string Database;
        public FbServerType ServerType;
        public string UserID;
        public string Password;
        public string ClientLibrary;

        // process
        public string Type;
        public string Query;
        public string OutputFile;

        public void LoadConfig(string filepath)
        {
            JObject config = JObject.Parse(File.ReadAllText(filepath));

            // Database
            JToken value = null;
            config.TryGetValue("Database", out value);
            if (value != null) this.Database = value.ToString();

            // ServerType
            value = null;
            config.TryGetValue("ServerType", out value);
            if (value != null)
            {
                var v = value.ToString();
                if (v == "Embedded") this.ServerType = FbServerType.Embedded;
                else this.ServerType = FbServerType.Default;
            }

            // UserID
            value = null;
            config.TryGetValue("UserID", out value);
            if (value != null) this.UserID = value.ToString();

            // Password
            value = null;
            config.TryGetValue("Password", out value);
            if (value != null) this.Password = value.ToString();

            // Client Library
            value = null;
            config.TryGetValue("ClientLibrary", out value);
            if (value != null) this.ClientLibrary = value.ToString();

            // Type
            value = null;
            config.TryGetValue("Type", out value);
            if (value != null) this.Type = value.ToString();

            // Query
            value = null;
            config.TryGetValue("Query", out value);
            if (value != null) this.Query = value.ToString();

            // OutputFile
            value = null;
            config.TryGetValue("OutputFile", out value);
            if (value != null) this.OutputFile = value.ToString();
        }
    }
}
