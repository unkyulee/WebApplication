using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;

namespace Web.Application.Interfaces
{
    public interface IModule
    {
        Task<string> Process(HttpContext context);
        string Authenticated(HttpContext context);
    }
}
