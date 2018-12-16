import { DefaultDataSource } from "../dataSources/DefaultDataSource";

export const typeDef = `
    type Site {
        id: String
        name: String
        categories: [Category]
        posts: [Post]
    }

    input SiteInput {
        id: String
        name: String
    }

    type SiteResponse implements Response {
        site: Site
        success: Boolean!
        message: String
    }
    `
export const resolvers = {
    Query: {
        sites: async (_, args, { dataSources: { main } }) => {
            const data = main as DefaultDataSource
            const sites = await data.getSites();
            return sites;
        },
        site: async (_, { siteId }, { dataSources: { main } }) => {
            const data = main as DefaultDataSource
            const site = await data.getSite(siteId);
            return site;
        }
    },
    Mutation: {
        upsertSite: async (_, args, { dataSources: { main } }) => {
            const data = main as DefaultDataSource
            const upsertedSite = await data.upsertSite(args.site)
            return {
                success: true,
                site: upsertedSite
            }
        },
        deleteSite: async (_, args, { dataSources: { main } }) => {
            const data = main as DefaultDataSource
            await data.deleteSite(args.siteId);
            return {
                success: true
            }
        },
    },
    Post: {
        site: async (post, args, { dataSources: { main } }) => {
            const data = main as DefaultDataSource
            const site = await data.getSiteFromPostId(post.id);
            return site;
        }
    }
}