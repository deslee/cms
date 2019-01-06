import ApolloClient from "apollo-boost";

export function getClient(jwtToken: string) {
    const headers = {};

    if (jwtToken && jwtToken.length) {
        headers['Authorization'] = `Bearer ${jwtToken}`
    }

    const client = new ApolloClient({
        uri: `${process.env.REACT_APP_BACKEND_URL}/graphql`,
        headers: headers
    });

    return client;
}