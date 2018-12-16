export const typeDef = `
type Mutation {
    upsertSite(site: SiteInput!): SiteResponse!
    deleteSite(siteId: String!): GenericResponse!
    upsertPost(post: PostInput!): PostResponse!
    deletePost(postId: String!): GenericResponse!
}
`

export const resolvers = () => { }