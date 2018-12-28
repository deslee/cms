import * as React from 'react'

export type AuthUser = any;

export interface AuthUserContext {
    user?: AuthUser;
    updateUser: (user: AuthUser) => void;
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