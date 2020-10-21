using Newtonsoft.Json.Linq;
using System.IO;

namespace FirebirdEx
{
    class Config
    {
        // connection
        public string Database;
        public string ServerType;
        public string UserID;
        public string Password;
        public string ClientLibrary;

        // process
        public string Type;
        public string Query;

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
            if (value != null) this.ServerType = value.ToString();

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
            if (value != null) this.ClientLibrary = value.ToString();

            // Query
            value = null;
            config.TryGetValue("Query", out value);
            if (value != null) this.ClientLibrary = value.ToString();


        }
    }
}
