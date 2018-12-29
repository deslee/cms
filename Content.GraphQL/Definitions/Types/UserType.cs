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
using Content.GraphQL.Services;
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
        public const string NAME_KEY = "Name";

        public UserType(IUserService userService, DataContext dataContext)
        {
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
                resolve: context => context.Source.Data[NAME_KEY]
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
        }
    }
}