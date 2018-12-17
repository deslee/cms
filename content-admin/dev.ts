const { ApolloServer } = require('apollo-server')
import { typeDefs, resolvers } from './schema'
import { DefaultDataSource } from './dataSources/DefaultDataSource';
import { ContentRepository } from 'content-data';
import { MessageBus } from 'content-message-bus';
import * as _ from 'lodash'
import { createLogger } from 'content-logs';
import { config } from './config';

// context to log
const logger = createLogger({
    mongoUrl: config.get('logHost'),
    logFile: config.get('logFile'),
    context: {
        serviceName: 'content-admin',
        environment: config.get('env')
    }
})

logger.info("Configuration loaded", { config: config.getProperties() })

const contentRepository = new ContentRepository({
    dialect: 'postgres',
    database: 'content-data',
    username: config.get('postgresUsername'),
    password: config.get('postgresPassword'),
    host: config.get('postgresHost'),
    port: config.get('postgresPort'),
    logging: (str) => { logger.info(str, { methodName: 'SQL repossitory' }) }
})
const messageBus = new MessageBus({
    nats: {
        url: config.get('natsUrl')
    }
}, logger)

messageBus.connect();

const apolloConfig = {
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

const server = new ApolloServer(apolloConfig);

server.listen().then(({ url }) => {
    logger.info(`🚀  Server ready at ${url}`, {});
});
