import { MessageBus, Subjects } from 'content-message-bus'
import * as winston from 'winston'
import {
    UpsertPostCommandHandler,
    UpsertSiteCommandHandler,
    DeletePostCommandHandler,
    DeleteSiteCommandHandler
} from './handlers'
import { ContentRepository } from './data';

// context to log
const serverContext = {
    serviceName: 'content-data',
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
        errorStackTracerFormat(),
    ),
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(), 
                winston.format.padLevels(),
                winston.format(info => {
                    const padding = info.padding && info.padding[info.level] || '';
                    info.message = `[${info.serviceName}-${info.environment}]${padding} ${info.message}`
                    return info;
                })(),
                winston.format.simple()
            ),
            handleExceptions: true
        }),
        new winston.transports.File({ 
            filename: '../dev.log',
            format: winston.format.combine(
                winston.format.colorize(), 
                winston.format.padLevels(),
                winston.format(info => {
                    const padding = info.padding && info.padding[info.level] || '';
                    info.message = `[${info.serviceName}-${info.environment}]${padding} ${info.message}`
                    return info;
                })(),
                winston.format.simple()
            ),
            handleExceptions: true
        })
    ],
    exitOnError: false
})

// create a data repository
var repository = new ContentRepository({
    dialect: 'sqlite',
    storage: '../dev.database.sqlite',
    logging: (str) => { logger.info(str) }
})

// create a message bus service
var messageBus = new MessageBus({
    nats: {}
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

    logger.info('content-data connected to message bus')
}

export function stopService() {
    messageBus.close();
}

startService();