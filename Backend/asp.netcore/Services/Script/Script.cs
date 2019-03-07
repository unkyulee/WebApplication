using Microsoft.AspNetCore.Http;
using Service.Script.Scripts;
using System.Collections.Generic;
using System.Threading.Tasks;
using Web.Application.Lib;

namespace Web.Application.Services
{
    public class Script 
    {
        public async static Task<object> Run(
            HttpContext context
            , string script_id
            , string configuration
            , IList<object> dataservices)
        {
            object result = null;
            configuration = Tools.PreProcess(configuration);

            switch (script_id) {
                case "40":
                    result = SQL_List.Run(context, configuration, dataservices);
                    break;

                case "60":
                    result = SQL_Insert.Run(context, configuration, dataservices);
                    break;

                case "70":
                    result = SQL_Update.Run(context, configuration, dataservices);
                    break;

                case "80":
                    result = SQL_Delete.Run(context, configuration, dataservices);
                    break;

                case "90":
                    result = SQL_Query.Run(context, configuration, dataservices);
                    break;

                case "100":
                    result = SQL_Upload.Run(context, configuration, dataservices);
                    break;

                case "110":
                    result = SQL_Download.Run(context, configuration, dataservices);
                    break;

                case "140":
                    result = SQL_UserUpsert.Run(context, configuration, dataservices);
                    break;

                case "150":
                    result = SQL_UserChangePassword.Run(context, configuration, dataservices);
                    break;

                case "160":
                    result = File_Upload.Run(context, configuration, dataservices);
                    break;

                case "170":
                    result = File_Download.Run(context, configuration, dataservices);
                    break;
                case "180":
                    result = await REST_Request.Run(context, configuration, dataservices);
                    break;
            } 

            return result;
        }

        
    }
}
