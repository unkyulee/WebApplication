using System;

namespace FirebirdEx
{
    class Program
    {
        static void Main(string[] args)
        {
            // load config
            var path = System.Reflection.Assembly.GetExecutingAssembly().Location;
            var directory = System.IO.Path.GetDirectoryName(path);
            var filename = "firebird.json";
                        
            // process
            FireBirdTools tools = new FireBirdTools($"{directory}\\{filename}");
            tools.Execute();
		}
    }
}
