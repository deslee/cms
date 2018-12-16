export const typeDef = `
type Mutation {
    upsertSite(site: SiteInput!): UpsertResponse!
    deleteSite(siteId: String!): GenericResponse!
    upsertPost(post: PostInput!): UpsertResponse!
    deletePost(postId: String!): GenericResponse!
}
`

export const resolvers = () => { }