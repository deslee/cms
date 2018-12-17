import { PostInput, SiteInput, CommandResponse, UpsertCommandResponse } from "../data";
import { ContentRepository } from '../data'
import { Command } from "../data/commands";
import * as winston from 'winston'
import * as _ from 'lodash'
import { ApplicationLogger } from "content-message-bus/node_modules/content-logs";

class DataCommandHandler {
    repository: ContentRepository;
    logger: ApplicationLogger;
    constructor(repository: ContentRepository, logger: ApplicationLogger) {
        this.repository = repository
        this.logger = logger;
    }
}

export class UpsertSiteCommandHandler extends DataCommandHandler {
    async handle(command: Command<SiteInput>): Promise<UpsertCommandResponse> {
        this.logger.log('info', `called UpsertSiteCommandHandler.handle`, _.merge({ method: 'UpsertSiteCommandHandler.handle', command: command }))
        //const profiler = this.logger.startTimer();
        try {
            var id = await this.repository.upsertSite(command.payload);
            return {
                success: true,
                created: id
            }
        } catch (err) {
            this.logger.error(`caught in UpsertSiteCommandHandler.handle`, _.merge({ method: 'DeleteSiteCommandHandler.handle', command: command, error: err }))
            return {
                success: false,
                error: err
            }
        } finally {
            //profiler.done({ message: 'Done calling UpsertSiteCommandHandler.handle', meta: { correlationId: command.correlationId, method: 'DeleteSiteCommandHandler.handle' } })
        }
    }
}

export class UpsertPostCommandHandler extends DataCommandHandler {
    async handle(command: Command<PostInput>): Promise<UpsertCommandResponse> {
        this.logger.log('info', `called UpsertPostCommandHandler.handle`, _.merge({ method: 'UpsertPostCommandHandler.handle', command: command }))
        //const profiler = this.logger.startTimer();
        try {
            var id = await this.repository.upsertPost(command.payload)
            return {
                success: true,
                created: id
            }
        } catch (err) {
            this.logger.error(`caught in UpsertPostCommandHandler.handle`, _.merge({ method: 'DeleteSiteCommandHandler.handle', command: command, error: err }))
            return {
                success: false,
                error: err
            }
        } finally {
            //profiler.done({ message: 'Done calling UpsertPostCommandHandler.handle', meta: { correlationId: command.correlationId, method: 'DeleteSiteCommandHandler.handle' } })
        }
    }
}

export class DeleteSiteCommandHandler extends DataCommandHandler {
    async handle(command: Command<string>): Promise<CommandResponse> {
        this.logger.log('info', `called DeleteSiteCommandHandler.handle`, _.merge({ method: 'DeleteSiteCommandHandler.handle', command: command }))
        //const profiler = this.logger.startTimer();
        try {
            await this.repository.deleteSite(command.payload)
            return {
                success: true
            }
        } catch (err) {
            this.logger.error(`caught in DeleteSiteCommandHandler.handle`, _.merge({ method: 'DeleteSiteCommandHandler.handle', command: command, error: err }))
            return {
                success: false,
                error: err
            }
        } finally {
            //profiler.done({ message: 'Done calling DeleteSiteCommandHandler.handle', meta: { correlationId: command.correlationId, method: 'DeleteSiteCommandHandler.handle' } })
        }
    }
}

export class DeletePostCommandHandler extends DataCommandHandler {
    async handle(command: Command<string>): Promise<CommandResponse> {
        this.logger.log('info', `called DeletePostCommandHandler.handle`, _.merge({ method: 'DeletePostCommandHandler.handle', command: command }))
        //const profiler = this.logger.startTimer();
        try {
            await this.repository.deletePost(command.payload)
            return {
                success: true
            }
        } catch (err) {
            this.logger.error(`caught in DeletePostCommandHandler.handle`, _.merge({ method: 'DeleteSiteCommandHandler.handle', command: command, error: err }))
            return {
                success: false,
                error: err
            }
        } finally {
            //profiler.done({ message: 'Done calling DeletePostCommandHandler.handle', meta: { correlationId: command.correlationId, method: 'DeleteSiteCommandHandler.handle' } })
        }
    }
}