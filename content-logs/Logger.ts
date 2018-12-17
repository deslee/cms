import * as winston from 'winston';
import * as _ from 'lodash';

export class ApplicationLogger {
    logger: winston.Logger;
    context: any[];

    constructor(logger: winston.Logger, context: any) {
        this.logger = logger
        if (!context.length) {
            context = [context]
        }
        this.context = context
    }

    createChild(context: any[]) {
        return new ApplicationLogger(this.logger, [...this.context, context])
    }

    log(level: string, message: string, context: any) {
        this.logger.log(level, message, { meta: _.merge(_.merge.apply(_, [...this.context]), context)  } )
    }

    warn(message: string, context: any) {
        this.log('warn', message, context)
    }

    error(message: string, context: any) {
        this.log('error', message, context)
    }

    info(message: string, context: any) {
        this.log('info', message, context)
    }

    debug(message: string, context: any) {
        this.log('warn', message, context)
    }

    startTimer(): winston.Profiler {
        return this.logger.startTimer();
    }
}