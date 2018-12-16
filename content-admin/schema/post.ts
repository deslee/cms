import { DefaultDataSource } from "../dataSources/DefaultDataSource";

export const typeDef = `
    type Post {
        id: String
        title: String
        site: Site
        date: String
        password: String
        categories: [Category]
        slices: [Slice]
    }

    input PostInput {
        id: String
        siteId: String!
        title: String
        date: String
        password: String
        categories: [String]
        slices: [SliceInput]
    }

    type PostResponse implements Response {
        post: Post
        success: Boolean!
        message: String
    }
    `
export const resolvers = {
    Query: {
        posts: async (_, { siteId }, { dataSources: { main } }) => {
            const data = main as DefaultDataSource
            const posts = await data.getPostsForSite(siteId);
            return posts;
        },
        post: async (_, { postId }, { dataSources: { main } }) => {
            const data = main as DefaultDataSource
            const posts = await data.getPost(postId);
            return posts;
        }
    },
    Mutation: {
        upsertPost: async (_, args, { dataSources: { main } }) => {
            const data = main as DefaultDataSource
            const upsertedPost = await data.upsertPost(args.post);
            return {
                success: true,
                post: upsertedPost
            }
        },
        deletePost: async (_, args, { dataSources: { main } }) => {
            const data = main as DefaultDataSource
            await data.deletePost(args.postId);
            return {
                success: true
            }
        }
    },
    Site: {
        posts: async (site, args, { dataSources: { main } }) => {
            const data = main as DefaultDataSource
            const posts = await data.getPostsForSite(site.id);
            return posts;
        }
    },
    Category: {
        posts: async (category, args, { dataSources: { main } }) => {
            const data = main as DefaultDataSource
            const posts = await data.getPostsForCategory(category.id);
            return posts;
        }
    }
}