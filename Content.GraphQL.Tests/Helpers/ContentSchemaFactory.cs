using System;
using AutoMapper;
using Content.Data;
using Content.GraphQL.Definitions;
using Content.GraphQL.Definitions.Types;
using Content.GraphQL.MapperProfiles;
using GraphQL;
using Microsoft.EntityFrameworkCore;
using Ninject;

namespace Content.GraphQL.Tests {
    public static class ContentSchemaFactory {
        public static ContentSchema CreateContentSchema() {
            IKernel kernel = new StandardKernel();

            var dataContext = new DataContext(new DbContextOptionsBuilder<DataContext>()
                .UseSqlite("Data Source=content.tests.db").Options);

            dataContext.Database.EnsureDeleted();
            dataContext.Database.Migrate();

            kernel.Bind<IMapper>().ToConstant(new MapperConfiguration(cfg => cfg.AddProfile<ContentMapperProfile>()).CreateMapper());
            kernel.Bind<DataContext>().ToConstant(dataContext);
            kernel.Bind<ContentQuery>().ToSelf();
            kernel.Bind<ContentMutation>().ToSelf();
            kernel.Bind<ContentSchema>().ToConstant(new ContentSchema(new FuncDependencyResolver(resolver: type => kernel.Get(type))));

            foreach (Type type in typeof(ContentSchema).Assembly.GetTypes())
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