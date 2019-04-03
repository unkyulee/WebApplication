using Newtonsoft.Json;

namespace Web.Application.Lib
{
    public class StringUtils
    {
        // Convert multiline string between """ to a single line
        public static string MultilineToSingle(string content)
        {
            int startPos = 0;
            int endPos = 0;

            while (true)
            {
                startPos = content.IndexOf("\"\"\"");
                if (startPos < 0) break;
                endPos = content.IndexOf("\"\"\"", startPos + 3);

                string part = content.Substring(startPos, endPos - startPos + 3);
                // do something with part
                string replaced = part.Replace("\"\"\"", "");
                replaced = JsonConvert.SerializeObject(replaced);

                content = content.Replace(part, replaced);
            }

            return content;
        }
    }
}
