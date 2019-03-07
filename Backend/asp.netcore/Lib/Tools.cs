using Newtonsoft.Json;

namespace Web.Application.Lib
{
    public class Tools
    {
        public static string PreProcess(string config)
        {
            int startPos = 0;
            int endPos = 0;

            while (true)
            {
                startPos = config.IndexOf("\"\"\"");
                if (startPos < 0) break;
                endPos = config.IndexOf("\"\"\"", startPos + 3);

                string part = config.Substring(startPos, endPos - startPos + 3);
                // do something with part
                string replaced = part.Replace("\"\"\"", "");
                replaced = JsonConvert.SerializeObject(replaced);

                config = config.Replace(part, replaced);
            }

            return config;
        }
    }
}
