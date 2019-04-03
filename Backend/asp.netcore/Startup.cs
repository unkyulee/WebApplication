using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System.IO;
using System.Reflection;
using Web.Application.Modules;
using Web.Application.Services;
using Web.Application.Services.DB;
using Web.Appliction.Lib;

namespace WebApplication
{
    public class Startup
    {
        // Configuration Object - loaded in Startup constructor
        private IHostingEnvironment env;
        public Startup(IHostingEnvironment env)
        {
            this.env = env;            
        }

        public void ConfigureServices(IServiceCollection services)
        {
            ///
            /// Configuration 
            ///
            // Setup configuration object from appsettings.json
            IConfigurationBuilder builder = new ConfigurationBuilder();
            
            // save to configuration object
            string appSettingsPath = Path.Combine(
                Path.GetDirectoryName(Assembly.GetEntryAssembly().Location),
                "appsettings.json");

            // add appsetting file to config
            if (File.Exists(appSettingsPath))
                builder = builder.AddJsonFile(appSettingsPath);

            // add environment to config
            builder.AddEnvironmentVariables();
            
            // add appsetting paths to config
            var config = builder.Build();
            config["appsettings.json"] = appSettingsPath;

            // register configuration instance
            services.AddSingleton<IConfiguration>(config);
        }


        public void Configure(
            IApplicationBuilder app
            , IConfiguration config
            , IHostingEnvironment hosting
        )
        {
            app.UseStaticFiles();

            // user dev error page
            app.UseDeveloperExceptionPage();
                        
            ///
            /// Render Site
            ///                 
            app.Run(async (context) =>
            {
                // pass global app config
                context.Items["secret"] = config["secret"];
                context.Items["db"] = new SQL($"{config["connectionString"]}");
                context.Items["WebRootPath"] = hosting.WebRootPath;

                // pre process the request
                if (Router.PreProcess(context) == false)
                    return;

                // Use route service to figure out the navigation information
                var navigation = Router.ResolveNavigation(context);
                context.Items["navigation"] = navigation; // save navigation to the context
                if (navigation == null)
                {
                    context.Response.StatusCode = StatusCodes.Status404NotFound;
                    return;
                }
                
                // Locate the module                    
                IModule module = Router.GetModule($"{navigation.Get("module")}");
                context.Items["module"] = module; // save module to the context
                if ( module == null )
                {
                    // if the module is not found then "Page not found"
                    context.Response.StatusCode = StatusCodes.Status404NotFound;
                    return;
                }

                // Verify authentication                                        
                if (Auth.CanModuleProcess(context) == true) {
                    string result = await module.Process(context);
                    if (result != null) await context.Response.WriteAsync(result);
                    return;
                }                
                
            });
        }        
    }
}

