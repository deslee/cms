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
            return await data.upsertSite(args.site)
        },
        deleteSite: async (_, args, { dataSources: { main } }) => {
            const data = main as DefaultDataSource
            return await data.deleteSite(args.siteId);
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