using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Content.Data;
using Content.Data.Models;
using Content.GraphQL.Definitions.Types.Input;
using Content.GraphQL.Models;
using GraphQL;
using GraphQL.Types;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json.Linq;

namespace Content.GraphQL.Definitions.Types
{
    public class UserType : ObjectGraphType<User>
    {
        private readonly DataContext dataContext;
        private readonly AppSettings appSettings;
        public UserType(DataContext dataContext, AppSettings appSettings)
        {
            this.dataContext = dataContext;
            this.appSettings = appSettings;
            Name = "User";
            Field<StringGraphType>(
                name: "id",
                resolve: context => context.Source.Id
            );
            Field<StringGraphType>(
                name: "email",
                resolve: context => context.Source.Email
            );
            Field<StringGraphType>(
                name: "name",
                resolve: context => context.Source.Data["Name"]
            );
            FieldAsync<ListGraphType<SiteType>>(
                name: "sites",
                resolve: async context =>
                {
                    dataContext.Attach(context.Source);

                    return await dataContext.Entry(context.Source)
                        .Collection(u => u.SiteUsers)
                        .Query()
                        .Include(su => su.Site)
                        .Select(su => su.Site)
                        .ToListAsync();
                }
            );
            FieldAsync<StringGraphType>(
                name: "token",
                resolve: async context =>
                {
                    var token = await Task.Run(() =>
                    {
                        var tokenHandler = new JwtSecurityTokenHandler();
                        var key = Encoding.ASCII.GetBytes(appSettings.Secret);
                        var tokenDescriptor = new SecurityTokenDescriptor
                        {
                            Subject = new ClaimsIdentity(new[] {
                            new Claim(ClaimTypes.Email, context.Source.Email.ToString())
                        }),
                            Expires = DateTime.UtcNow.AddDays(7),
                            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
                        };
                        var jwtToken = tokenHandler.CreateToken(tokenDescriptor);
                        return tokenHandler.WriteToken(jwtToken);
                    });
                    return token;
                }
            );
        }
    }
}