const { ApolloServer } = require('apollo-server')
import { typeDefs, resolvers } from './schema'
import { DefaultDataSource } from './dataSources/DefaultDataSource';
import { ContentRepository } from 'content-data';
import { MessageBus } from '../content-message-bus/dist';
import * as winston from 'winston'


// create a logger
const logger = winston.createLogger({
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: '../dev.log' })
    ]
})

const contentRepository = new ContentRepository({
    dialect: 'sqlite',
    storage: '../dev.database.sqlite',
    logging: (str) => {
        logger.info(str)
    }
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
    logger.info(`🚀  Server ready at ${url}`);
});