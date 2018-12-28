import { Config, config } from "../config";
import { AuthUser, AuthUserConsumer, AuthUserContext } from "./auth";

export class Api {
    config: Config;
    user: AuthUser | undefined;

    constructor(config: Config, user?: AuthUser) {
        this.config = config;
        this.user = user;
    }

    query = async (query: { query: string, variables?: any }) => {
        var headers: HeadersInit = {
            'Content-Type': 'application/json'
        }

        if (this.user && this.user.token) {
            headers['Authorization'] = `Bearer ${this.user.token}`
        }

        var response = await fetch(
            this.config.backendUrl,
            {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    query: query.query,
                    variables: query.variables || {}
                })
            }
        )

        if (response.ok) {
            var json = response.json();
            return json;
        } else {
            throw new Error("Bad response");
        }
    }

    login = async (credentials: { email: string, password: string }): Promise<AuthUser> => {
        var response = await this.query({
            query: `
                mutation login($login: LoginInput!) {
                    login(login: $login) {
                        success,
                        errorMessage,
                        data {
                            id
                            email
                            name
                        }
                        token
                    }
                }
            `,
            variables: {
                login: {
                    email: credentials.email,
                    password: credentials.password
                }
            }
        });

        let login = response.data.login;
        if (!login.success) {
            throw new Error("Failed login");
        }

        return {
            email: login.data.email,
            name: login.data.name,
            token: login.token
        }
    }
}

export interface WithApiInjectedProps {
    api: Api
}

export const withApi = <P extends object>(Component: React.ComponentType<P & WithApiInjectedProps>) => {
    return (props: P) => (
        <AuthUserConsumer>{ (authUserContext: AuthUserContext) => (
            <Component {...props} api={new Api(config, authUserContext.user)} />
        )}</AuthUserConsumer>
    )
}