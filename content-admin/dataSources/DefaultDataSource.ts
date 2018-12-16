import { Site, Slice, Post, Category, SiteInput, PostInput, ContentRepository, CommandResponse, UpsertCommandResponse } from 'content-data'
import { MessageBus, Subjects } from 'content-message-bus'
import { DataSource } from "apollo-datasource";

export class DefaultDataSource extends DataSource {
    repository: ContentRepository;
    messageBus: MessageBus;
    constructor(repository: ContentRepository, messageBus: MessageBus) {
        super()
        this.repository = repository;
        this.messageBus = messageBus;
    }

    async deleteSite(siteId: string): Promise<CommandResponse> {
        try {
            return await this.messageBus.request<string, CommandResponse>(Subjects.Commands.Site.Delete, siteId, 1000)
        } catch (error) {
            console.log("data source error", error)
            return {
                error: JSON.stringify(error),
                success: false
            }
        }
    }

    async deletePost(postId: string): Promise<CommandResponse> {
        try {
            return await this.messageBus.request<string, CommandResponse>(Subjects.Commands.Post.Delete, postId, 1000)
        } catch (error) {
            console.log("data source error", error)
            return {
                error: JSON.stringify(error),
                success: false
            }
        }
    }

    async upsertPost(post: PostInput): Promise<UpsertCommandResponse> {
        try {
            return await this.messageBus.request<PostInput, UpsertCommandResponse>(Subjects.Commands.Post.Upsert, post, 1000)
        } catch (error) {
            console.log("data source error", error)
            return {
                error: JSON.stringify(error),
                success: false
            }
        }
    }

    async upsertSite(site: SiteInput): Promise<UpsertCommandResponse> {
        try {
            return await this.messageBus.request<SiteInput, UpsertCommandResponse>(Subjects.Commands.Site.Upsert, site, 1000)
        } catch (error) {
            console.log("data source error", error)
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