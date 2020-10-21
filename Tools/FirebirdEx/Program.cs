using System;


namespace FirebirdEx
{
    class Program
    {
        static void Main(string[] args)
        {
            if(args.Length < 2)
            {
                Console.WriteLine("Config filepath is missing");
                return;
            }
            Config config = new Config();
            config.LoadConfig(args[1]);
		}
    }
}
