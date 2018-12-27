using Content.GraphQL.Definitions;
using Content.GraphQL.Tests.Extensions;
using Xunit;

namespace Content.GraphQL.Tests {
    public class FullIntegrationTest {
        private readonly ContentSchema schema;

        public FullIntegrationTest() {
            schema = ContentSchemaFactory.CreateContentSchema("Data Source=full-integration-tests.db");
        }

        [Fact]
        public void CreateUser() {
        }
    }
}