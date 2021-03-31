using System;
using System.Globalization;

namespace FirebirdEx
{
    class Program
    {
        static void Main(string[] args)
        {
            // load config
            String filepath = "default.json";
            if (args.Length > 1) filepath = args[1];
            Config config = new Config();
            config.LoadConfig(filepath);

            // process
            FireBirdTools tools = new FireBirdTools();
            tools.Execute(config);
		}
    }
}
