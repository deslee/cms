const { ApolloServer } = require('apollo-server')
import { typeDefs, resolvers } from './schema'
import { DefaultDataSource } from './dataSources/DefaultDataSource';
import { ContentRepository } from 'content-data';
import { MessageBus } from '../content-message-bus/dist';

const contentRepository = new ContentRepository({
    dialect: 'sqlite',
    storage: '../dev.database.sqlite',
    logging: true
})
const messageBus = new MessageBus({
    nats: {}
})

messageBus.connect();

const config = { 
    typeDefs, 
    resolvers, 
    dataSources: () => {

        return {
            main: new DefaultDataSource(
                contentRepository, messageBus
            )
        }
    }
};

const server = new ApolloServer(config);

server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
});