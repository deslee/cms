export const typeDef = `
type Query {
    sites: [Site]!
    site(siteId: String!): Site
    posts(siteId: String!): [Post]!
    post(postId: String!): Post
    categories(siteId: String!): [Category]!
}
`

export const resolvers = () => { }