import { DefaultDataSource } from "../dataSources/DefaultDataSource";

export const typeDef = `
    type Category {
        id: String
        site: Site
        name: String
        posts: [Post]
    }
    `
export const resolvers = {
    Post: {
        categories: async (post, args, { dataSources: { main } }) => {
            const data = main as DefaultDataSource
            const categories = await data.getCategoriesForPost(post.id);
            return categories;
        }
    },
    Site: {
        categories: async (site, args, { dataSources: { main } }) => {
            const data = main as DefaultDataSource
            const categories = await data.getCategoriesForSite(site.id);
            return categories;
        }
    }
}