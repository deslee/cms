using System;
using Content.Data;
using Content.GraphQL.Definitions;
using Content.GraphQL.Definitions.Types;
using Content.GraphQL.Services;
using GraphQL;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Moq;
using Ninject;

namespace Content.GraphQL.Tests {
    public static class ContentSchemaFactory {
        public static ContentSchema CreateContentSchema(string connectionString) {
            IKernel kernel = new StandardKernel();

            var dataContext = new DataContext(new DbContextOptionsBuilder<DataContext>()
                .UseSqlite(connectionString).Options);

            dataContext.Database.EnsureDeleted();
            dataContext.Database.Migrate();

            kernel.Bind<IMapper>().ToConstant(new MapperConfiguration(cfg => cfg.AddProfile<ContentMapperProfile>()).CreateMapper());
            kernel.Bind<DataContext>().ToConstant(dataContext);

            kernel.Bind<ILogger<SiteService>>().ToConstant(Mock.Of<ILogger<SiteService>>());
            kernel.Bind<ILogger<UserService>>().ToConstant(Mock.Of<ILogger<UserService>>());
            kernel.Bind<ILogger<PostService>>().ToConstant(Mock.Of<ILogger<PostService>>());
        
            kernel.Bind<IUserService>().To<UserService>();
            kernel.Bind<ISiteService>().To<SiteService>();
            kernel.Bind<IPostService>().To<PostService>();

            kernel.Bind<ContentQuery>().ToSelf();
            kernel.Bind<ContentMutation>().ToSelf();
            kernel.Bind<ContentSchema>().ToConstant(new ContentSchema(new FuncDependencyResolver(resolver: type => kernel.Get(type))));
            

            foreach (Type type in typeof(SiteType).Assembly.GetTypes())
            {
                if (type.Namespace != null && type.Namespace.StartsWith(typeof(SiteType).Namespace))
                {
                    kernel.Bind(type).ToSelf();
                }
            }

            return kernel.Get<ContentSchema>();
        }
    }
}