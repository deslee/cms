
import { config } from '../config';

import ApolloClient from "apollo-boost";

export function getClient(jwtToken: string) {
    const client = new ApolloClient({
        uri: config.backendUrl
    });

    return client;
}