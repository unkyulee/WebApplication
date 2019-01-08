using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;

namespace Web.Application.Interfaces
{
    public interface IModule
    {
        string Process(HttpContext context);
        string Authenticated(HttpContext context);
    }
}
