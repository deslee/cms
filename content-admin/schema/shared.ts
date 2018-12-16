export const typeDef = `
    interface Response {
        success: Boolean!
        message: String
    }
    type GenericResponse implements Response {
        success: Boolean!
        message: String
        error: String
    }
    type UpsertResponse implements Response {
        success: Boolean!
        message: String
        created: String
        error: String
    }
    `
export const resolvers = {
    Response: {
        __resolveType(obj, context, info) {
            if (obj.created) return 'UpsertResponse'
            return 'GenericResponse'
        }
    }
}