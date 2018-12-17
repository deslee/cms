import { Site, Slice, Post, Category, SiteInput, PostInput, ContentRepository, CommandResponse, UpsertCommandResponse } from 'content-data'
import { MessageBus, Subjects } from 'content-message-bus'
import { DataSource } from "apollo-datasource";
import { Command } from 'content-data/dist/data/commands';
import * as uuid from 'uuid'
import { ApplicationLogger } from 'content-message-bus/node_modules/content-logs';

export class DefaultDataSource extends DataSource {
    repository: ContentRepository;
    messageBus: MessageBus;
    logger: ApplicationLogger;
    constructor(repository: ContentRepository, messageBus: MessageBus, logger: ApplicationLogger) {
        super()
        this.repository = repository;
        this.messageBus = messageBus;
        this.logger = logger;
    }

    async deleteSite(siteId: string): Promise<CommandResponse> {
        const correlation = uuid.v1()
        try {
            return await this.messageBus.request<Command<string>, CommandResponse>(Subjects.Commands.Site.Delete, {
                correlationId: correlation,
                payload: siteId
            }, 1000)
        } catch (error) {
            this.logger.error(`DefaultDataSource.deleteSite(): Caught error ${error}`, {
                correlationId: correlation,
                error: error instanceof Error ? error : new Error(error)
            })
            return {
                error: JSON.stringify(error),
                success: false
            }
        }
    }

    async deletePost(postId: string): Promise<CommandResponse> {
        const correlation = uuid.v1()
        try {
            return await this.messageBus.request<Command<string>, CommandResponse>(Subjects.Commands.Post.Delete, {
                correlationId: correlation,
                payload: postId
            }, 1000)
        } catch (error) {
            this.logger.error(`DefaultDataSource.deletePost(): Caught error ${error}`, {
                correlationId: correlation,
                error: error instanceof Error ? error : new Error(error)
            })
            return {
                error: JSON.stringify(error),
                success: false
            }
        }
    }

    async upsertPost(post: PostInput): Promise<UpsertCommandResponse> {
        const correlation = uuid.v1()
        try {
            return await this.messageBus.request<Command<PostInput>, UpsertCommandResponse>(Subjects.Commands.Post.Upsert, {
                correlationId: correlation,
                payload: post
            }, 1000)
        } catch (error) {
            this.logger.error(`DefaultDataSource.upsertPost(): Caught error ${error}`, {
                correlationId: correlation,
                error: error instanceof Error ? error : new Error(error)
            })
            return {
                error: JSON.stringify(error),
                success: false
            }
        }
    }

    async upsertSite(site: SiteInput): Promise<UpsertCommandResponse> {
        const correlation = uuid.v1()
        try {
            return await this.messageBus.request<Command<SiteInput>, UpsertCommandResponse>(Subjects.Commands.Site.Upsert, {
                correlationId: correlation,
                payload: site
            }, 1000)
        } catch (error) {
            this.logger.error(`DefaultDataSource.upsertSite(): Caught error ${error}`, {
                correlationId: correlation,
                error: error instanceof Error ? error : new Error(error)
            })
            return {
                error: JSON.stringify(error),
                success: false
            }
        }
    }

    async getSites(): Promise<Site[]> {
        // TODO: convert to message bus query
        return await this.repository.getSites();
    }

    async getSite(siteId: string): Promise<Site | null> {
        // TODO: convert to message bus query
        return await this.repository.getSite(siteId);
    }

    async getSiteFromPostId(postId: string): Promise<Site | null> {
        // TODO: convert to message bus query
        return await this.repository.getSiteFromPostId(postId);
    }

    async getCategoriesForPost(postId: string): Promise<Category[]> {
        // TODO: convert to message bus query
        return await this.repository.getCategoriesForPost(postId);
    }

    async getCategoriesForSite(siteId: string): Promise<Category[]> {
        // TODO: convert to message bus query
        return await this.repository.getCategoriesForSite(siteId);
    }

    async getPostsForSite(siteId: string): Promise<Post[]> {
        // TODO: convert to message bus query
        return await this.repository.getPostsForSite(siteId);
    }

    async getPost(postId: string): Promise<Post | undefined> {
        // TODO: convert to message bus query
        return await this.repository.getPost(postId);
    }

    async getPostsForCategory(categoryId: string): Promise<Post[]> {
        // TODO: convert to message bus query
        return await this.repository.getPostsForCategory(categoryId);
    }

}