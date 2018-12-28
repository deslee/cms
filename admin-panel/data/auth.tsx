import * as React from 'react'

export type AuthUser = {
    email: string
    name: string
    token: string
};

export type UpdateAuthUser = (user: AuthUser) => void;

export interface AuthUserContext {
    user?: AuthUser;
    updateUser: UpdateAuthUser;
}

const Context = React.createContext<AuthUserContext>({
    updateUser: (user: AuthUser) => { }
})

export const AuthUserProvider = Context.Provider;
export const AuthUserConsumer = Context.Consumer;

export const withAuth = <P extends object>(Component: React.ComponentType<P>) => {
    return (props: P) => (
        <AuthUserConsumer>{ (authUserContext: AuthUserContext) => (
            <Component {...props} {...authUserContext} />
        )}</AuthUserConsumer>
    )
}