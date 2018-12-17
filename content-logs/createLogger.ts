import { ApplicationLogger } from './Logger';
import * as winston from 'winston'
import * as _ from 'lodash'
require('winston-mongodb')

export type Config = {
    mongoUrl?: string,
    context: any,
    logFile: string
}

export function createLogger(config: Config): ApplicationLogger {
    const errorStackTracerFormat = winston.format(info => {
        if (info && info.error && info.error instanceof Error) {
            const error = {};
            info.message = `${info.message} ${info.error.stack}`;
            Object.getOwnPropertyNames(info.error).forEach(function (key) {
                error[key] = info.error[key];
            });
            info.error = error
        }

        return info;
    });

    // create a logger
    const logger = winston.createLogger({
        format: winston.format.combine(
            winston.format(info => {
                return _.merge(info, { meta: config.context })
            })({}),
            winston.format.timestamp(),
            errorStackTracerFormat()
        ),
        transports: [
            new winston.transports.Console({
                format: winston.format.combine(
                    winston.format.colorize(),
                    winston.format.padLevels(),
                    winston.format(info => {
                        const padding = info.padding && info.padding[info.level] || '';
                        info.message = `[${info.meta.serviceName}-${info.meta.environment}]${padding} ${info.message}`
                        return info;
                    })(),
                    winston.format.simple()
                ),
                handleExceptions: true
            }),
            new winston.transports.File({
                filename: config.logFile,
                format: winston.format.combine(
                    winston.format.colorize(),
                    winston.format.padLevels(),
                    winston.format(info => {
                        const padding = info.padding && info.padding[info.level] || '';
                        info.message = `[${info.meta.serviceName}-${info.meta.environment}]${padding} ${info.message}`
                        return info;
                    })(),
                    winston.format.simple()
                ),
                handleExceptions: true
            })
        ],
        exitOnError: false
    })

    if (config.mongoUrl) {
        logger.add(new winston.transports['MongoDB']({
            db: config.mongoUrl,
            format: winston.format.combine(
                winston.format.simple()
            )
        }))
    }

    if (!config.context) config.context = [];

    return new ApplicationLogger(logger, config.context);
}