
import { config } from '../config';

import ApolloClient from "apollo-boost";

export function getClient(jwtToken: string) {
    const headers = {};

    if (jwtToken && jwtToken.length) {
        headers['Authorization'] = `Bearer ${jwtToken}`
    }

    const client = new ApolloClient({
        uri: config.backendUrl,
        headers: headers
    });

    return client;
}