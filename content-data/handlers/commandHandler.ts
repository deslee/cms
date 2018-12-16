import { PostInput, SiteInput, CommandResponse, UpsertCommandResponse } from "../data";
import { ContentRepository } from '../data'
import { Command } from "../data/commands";
import * as winston from 'winston'

class DataCommandHandler {
    repository: ContentRepository;
    logger: winston.Logger;
    constructor(repository: ContentRepository, logger: winston.Logger) {
        this.repository = repository
        this.logger = logger;
    }
}

export class UpsertSiteCommandHandler extends DataCommandHandler {
    async handle(command: Command<SiteInput>): Promise<UpsertCommandResponse> {
        this.logger.log('info', `called UpsertSiteCommandHandler.handle`, command)
        const profiler = this.logger.startTimer();
        try {
            var id = await this.repository.upsertSite(command.payload);
            return {
                success: true,
                created: id
            }
        } catch (err) {
            this.logger.error(`caught in UpsertSiteCommandHandler.handle`, { command, err })
            return {
                success: false,
                error: err
            }
        } finally {
            profiler.done({ message: 'Done calling UpsertSiteCommandHandler.handle', correlationId: command.correlationId })
        }
    }
}

export class UpsertPostCommandHandler extends DataCommandHandler {
    async handle(command: Command<PostInput>): Promise<UpsertCommandResponse> {
        this.logger.log('info', `called UpsertPostCommandHandler.handle`, command)
        const profiler = this.logger.startTimer();
        try {
            var id = await this.repository.upsertPost(command.payload)
            return {
                success: true,
                created: id
            }
        } catch (err) {
            this.logger.error(`caught in UpsertPostCommandHandler.handle`, { command, err })
            return {
                success: false,
                error: err
            }
        } finally {
            profiler.done({ message: 'Done calling UpsertPostCommandHandler.handle', correlationId: command.correlationId })
        }
    }
}

export class DeleteSiteCommandHandler extends DataCommandHandler {
    async handle(command: Command<string>): Promise<CommandResponse> {
        this.logger.log('info', `called DeleteSiteCommandHandler.handle`, command)
        const profiler = this.logger.startTimer();
        try {
            await this.repository.deleteSite(command.payload)
            return {
                success: true
            }
        } catch (err) {
            this.logger.error(`caught in DeleteSiteCommandHandler.handle`, { command, err })
            return {
                success: false,
                error: err
            }
        } finally {
            profiler.done({ message: 'Done calling DeleteSiteCommandHandler.handle', correlationId: command.correlationId })
        }
    }
}

export class DeletePostCommandHandler extends DataCommandHandler {
    async handle(command: Command<string>): Promise<CommandResponse> {
        this.logger.log('info', `called DeletePostCommandHandler.handle`, command)
        const profiler = this.logger.startTimer();
        try {
            await this.repository.deletePost(command.payload)
            return {
                success: true
            }
        } catch (err) {
            this.logger.error(`caught in DeletePostCommandHandler.handle`, { command, err })
            return {
                success: false,
                error: err
            }
        } finally {
            profiler.done({ message: 'Done calling DeletePostCommandHandler.handle', correlationId: command.correlationId })
        }
    }
}