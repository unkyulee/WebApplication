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
            
            // process
            FireBirdTools tools = new FireBirdTools(filepath);
            tools.Execute();
		}
    }
}
