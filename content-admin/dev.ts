const { ApolloServer } = require('apollo-server')
import { typeDefs, resolvers } from './schema'
import { DefaultDataSource } from './dataSources/DefaultDataSource';
import { ContentRepository } from 'content-data';
import { MessageBus } from '../content-message-bus/dist';
import * as winston from 'winston'

// context to log
const serverContext = {
    serviceName: 'content-admin',
    environment: 'dev' // TODO set environment
}

const errorStackTracerFormat = winston.format(info => {
    if (info && info.error && info.error instanceof Error) {
        info.message = `${info.message} ${info.error.stack}`;
    }

    return info;
});

// create a logger
const logger = winston.createLogger({
    format: winston.format.combine(
        winston.format(info => { 
            return Object.assign(info, serverContext) 
        })({}),
        winston.format.timestamp(),
        errorStackTracerFormat()
    ),
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(), 
                winston.format.padLevels(),
                winston.format.simple()
            ),
            handleExceptions: true
        }),
        new winston.transports.File({ 
            filename: '../dev.log',
            format: winston.format.combine(
                winston.format.colorize(), 
                winston.format.padLevels(),
                winston.format.simple()
            ),
            handleExceptions: true
        })
    ],
    exitOnError: false
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
