import { PostInput, SiteInput, CommandResponse, UpsertCommandResponse } from "../data";
import { ContentRepository } from '../data'

class DataCommandHandler {
    repository: ContentRepository;
    constructor(repository: ContentRepository) {
        this.repository = repository
    }
}

export class UpsertSiteCommandHandler extends DataCommandHandler {
    async handle(site: SiteInput): Promise<UpsertCommandResponse> {
        try {
            var id = await this.repository.upsertSite(site);
            return {
                success: true,
                created: id
            }
        } catch (err) {
            return {
                success: false,
                error: err
            }
        }
    }
}

export class UpsertPostCommandHandler extends DataCommandHandler {
    async handle(post: PostInput): Promise<UpsertCommandResponse> {
        try {
            var id = await this.repository.upsertPost(post)
            return {
                success: true,
                created: id
            }
        } catch (err) {
            return {
                success: false,
                error: err
            }
        }
    }
}

export class DeleteSiteCommandHandler extends DataCommandHandler {
    async handle(siteId: string): Promise<CommandResponse> {
        try {
            await this.repository.deleteSite(siteId)
            return {
                success: true
            }
        } catch (err) {
            return {
                success: false,
                error: err
            }
        }
    }
}

export class DeletePostCommandHandler extends DataCommandHandler {
    async handle(postId: string): Promise<CommandResponse> {
        try {
            await this.repository.deletePost(postId)
            return {
                success: true
            }
        } catch (err) {
            return {
                success: false,
                error: err
            }
        }
    }
}