import { MessageBus, Subjects } from 'content-message-bus'
import * as winston from 'winston'
import {
    UpsertPostCommandHandler,
    UpsertSiteCommandHandler,
    DeletePostCommandHandler,
    DeleteSiteCommandHandler
} from './handlers'
import { ContentRepository } from './data';
import * as _ from 'lodash'
import { createLogger } from 'content-logs'
import { config } from './config';

const logger = createLogger({
    mongoUrl:  config.get('logHost'), 
    logFile: config.get('logFile'), 
    context: {
        serviceName: 'content-data',
        environment: config.get('env')
    }
})

logger.info("Configuration loaded", { config: config.getProperties() })

// create a data repository
var repository = new ContentRepository({
    dialect: 'postgres',
    database: 'content-data',
    username: config.get('postgresUsername'),
    password: config.get('postgresPassword'),
    host: config.get('postgresHost'),
    port: config.get('postgresPort'),
    logging: (str) => { logger.info(str, { methodName: 'SQL repossitory' }) }
})

// create a message bus service
var messageBus = new MessageBus({
    nats: {
        url: config.get('natsUrl')
    }
}, logger)

export function startService() {
    messageBus.connect();
    repository.sequelize.sync();

    // create handlers and subscribe
    const upsertPostCommandHandler = new UpsertPostCommandHandler(repository, logger);
    messageBus.subscribe(Subjects.Commands.Post.Upsert, upsertPostCommandHandler.handle.bind(upsertPostCommandHandler))
    const upsertSiteCommandHandler = new UpsertSiteCommandHandler(repository, logger);
    messageBus.subscribe(Subjects.Commands.Site.Upsert, upsertSiteCommandHandler.handle.bind(upsertSiteCommandHandler))
    const deletePostCommandHandler = new DeletePostCommandHandler(repository, logger);
    messageBus.subscribe(Subjects.Commands.Post.Delete, deletePostCommandHandler.handle.bind(deletePostCommandHandler))
    const deleteSiteCommandHandler = new DeleteSiteCommandHandler(repository, logger);
    messageBus.subscribe(Subjects.Commands.Site.Delete, deleteSiteCommandHandler.handle.bind(deleteSiteCommandHandler))

    logger.info('content-data connected to message bus', {})
}

export function stopService() {
    messageBus.close();
}

startService();