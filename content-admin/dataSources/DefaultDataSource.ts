import { Site, Slice, Post, Category, SiteInput, PostInput, ContentRepository } from 'content-data'
import { DataSource } from "apollo-datasource";

export class DefaultDataSource extends DataSource {
    constructor(repository: ContentRepository) {
        super()
    }

    async getSites(): Promise<Site[]> {
        let placeholder: any;
        return placeholder;
    }

    async getSite(siteId: string): Promise<Site | null> {
        let placeholder: any;
        return placeholder;
    }

    async getSiteFromPostId(postId: string): Promise<Site | null> {
        let placeholder: any;
        return placeholder;
    }

    async getCategoriesForPost(postId: string): Promise<Category[]> {
        let placeholder: any;
        return placeholder;
    }

    async getCategoriesForSite(siteId: string): Promise<Category[]> {
        let placeholder: any;
        return placeholder;
    }

    async getPostsForSite(siteId: string): Promise<Post[]> {
        let placeholder: any;
        return placeholder;
    }

    async getPost(postId: string): Promise<Post | undefined> {
        let placeholder: any;
        return placeholder;
    }

    async getPostsForCategory(categoryId: string): Promise<Post[]> {
        let placeholder: any;
        return placeholder;
    }

    async deleteSite(siteId: string): Promise<void> {
        let placeholder: any;
        return placeholder;
    }

    async deletePost(postId: string): Promise<void> {
    }

    async upsertPost(post: PostInput): Promise<string | undefined> {
        return null;
    }

    async upsertSite(site: SiteInput): Promise<string | undefined> {
        return null;
    }

}