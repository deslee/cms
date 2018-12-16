export const typeDef = `
enum AssetType {
    IMAGE
}

type Asset {
    id: String
    title: String
    type: AssetType
    description: String
    url: String
}
`

export const resolvers = () => { }