const { ApolloServer } = require('apollo-server')
import { typeDefs, resolvers } from './schema'
import { DefaultDataSource } from './dataSources/DefaultDataSource';
import { ContentRepository } from 'content-data';
import { MessageBus } from 'content-message-bus';
import * as _ from 'lodash'
import { createLogger } from 'content-logs';

// context to log
const logger = createLogger({
    mongoUrl:  'mongodb://localhost:27017/winston', // TODO: configure
    logFile: '../dev.log', // TODO: configure
    context: {
        serviceName: 'content-admin',
        environment: 'dev' // TODO set environment
    }
})

const contentRepository = new ContentRepository({
    dialect: 'sqlite',
    storage: '../dev.database.sqlite',
    logging: (str) => { logger.info(str, { methodName: 'SQL repossitory' }) }
})
const messageBus = new MessageBus({
    nats: {}
}, logger)

messageBus.connect();

const config = { 
    typeDefs, 
    resolvers, 
    dataSources: () => {
        return {
            main: new DefaultDataSource(
                contentRepository, messageBus, logger
            )
        }
    }
};

const server = new ApolloServer(config);

server.listen().then(({ url }) => {
    logger.info(`🚀  Server ready at ${url}`, {});
});
