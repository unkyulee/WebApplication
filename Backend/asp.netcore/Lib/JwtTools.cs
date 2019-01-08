using Microsoft.AspNetCore.Http;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using Web.Application.Services.DB;

namespace Web.Application.Lib
{
    public class JwtTool
    {
        const string Issuer = "localhost";
        const string Audience = "localhost";

        public static string CreateToken(
            HttpContext context
            , string id
            , string name
            , string[] roles
            )
        {
            // null test
            string secret = $"{context.Items["secret"]}";

            // setup the crypto
            // Create Security key using private key above:
            // not that latest version of JWT using Microsoft namespace instead of System            
            var securityKey = new SymmetricSecurityKey(Convert.FromBase64String(secret));

            // Also note that securityKey length should be >256b
            // so you have to make sure that your private key has a proper length
            //
            var credentials = new SigningCredentials(
                securityKey,
                SecurityAlgorithms.HmacSha256Signature);

            //  Finally create a Token
            var header = new JwtHeader(credentials);

            // PayLoad that contain information about the  customer
            IList<Claim> Claims = new List<Claim>();
            Claims.Add(new Claim(ClaimTypes.Name, id));
            Claims.Add(new Claim(ClaimTypes.NameIdentifier, name));

            // roles
            foreach (var role_id in roles)
                Claims.Add(new Claim("roles", role_id));

            // create payload
            var claimsIdentity = new ClaimsIdentity(Claims, "user");

            // Form the token payload with verifiers
            var securityTokenDescriptor = new SecurityTokenDescriptor()
            {
                Audience = Audience,
                Issuer = Issuer,
                Subject = claimsIdentity,
                Expires = DateTime.Now.AddDays(30),
                SigningCredentials = credentials
            };

            //
            var tokenHandler = new JwtSecurityTokenHandler();
            var plainToken = tokenHandler.CreateToken(securityTokenDescriptor);
            var signedAndEncodedToken = tokenHandler.WriteToken(plainToken);

            return signedAndEncodedToken;
        }

        // get roles
        public static IList<string> GetRoles(
            SQL db
            , string userDbId
            )
        {
            // null check
            if (db == null) return null;
            if (string.IsNullOrEmpty(userDbId)) return null;

            ISet<string> roles = new HashSet<string>();

            // get group that user belongs     
            /*
            var groups = db.GetGroups(userDbId);
            if (groups != null && groups.Count > 0)
            {
                foreach (var group in groups)
                {
                    var groupDbId = group.Get("_id")?.ToString();
                    // get role that group belongs
                    var roleList = db.GetRoles(groupDbId);
                    if (roleList != null && roleList.Count > 0)
                        foreach (var role in roleList)
                            roles.Add(role.Get("_id").ToString());
                }
            }
            */

            return roles.ToList();
        }        

        public static IDictionary<string, object> Decode(string token)
        {
            IDictionary<string, object> payload = null;

            if (string.IsNullOrEmpty(token) == false)
            {
                try
                {
                    var handler = new JwtSecurityTokenHandler();
                    var decoded = handler.ReadJwtToken(token);
                    payload = decoded.Payload;
                }
                catch { }

            }

            return payload;
        }


        public static IDictionary<string, object> Verify(string token, string secret)
        {
            if (string.IsNullOrEmpty(token) == false)
            {
                var handler = new JwtSecurityTokenHandler();

                // And finally when  you received token from client
                // you can  either validate it or try to  read
                try
                {
                    // setup the crypto
                    // Create Security key using private key above:
                    // not that latest version of JWT using Microsoft namespace instead of System
                    var securityKey = new SymmetricSecurityKey(Convert.FromBase64String(secret));

                    TokenValidationParameters validationParameters = new TokenValidationParameters();
                    validationParameters.IssuerSigningKey = securityKey;
                    validationParameters.ValidAudience = Audience;
                    validationParameters.ValidIssuer = Issuer;

                    SecurityToken validatedToken;
                    handler.ValidateToken(token, validationParameters, out validatedToken);

                    // decode the token
                    var decoded = handler.ReadJwtToken(token);
                    return decoded.Payload;
                }
                catch { }

            }

            return null;
        }




    }
}
