using System;
using System.Security.Claims;
using System.Threading.Tasks;
using Content.Data;
using Content.GraphQL.Constants;
using Content.GraphQL.Requirements;
using GraphQL.Authorization;
using Microsoft.EntityFrameworkCore;

namespace Content.GraphQL.Services
{
    public interface IDataContextProvider
    {
        DataContext Provide();
    }
    public class DataContextProvider : IDataContextProvider
    {
        private DbContextOptions<DataContext> options;

        public DataContextProvider(DbContextOptions<DataContext> options)
        {
            this.options = options;
        }

        public DataContext Provide()
        {
            return new DataContext(options);
        }
    }
}