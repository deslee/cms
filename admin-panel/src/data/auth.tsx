import * as React from 'react'
/* variation on https://medium.com/@DanHomola/react-higher-order-components-in-typescript-made-simple-6f9b55691af1 */
import { wrapDisplayName } from 'recompose'

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

// thanks to https://gist.github.com/rosskevin/6c103846237ecbc77862ea0f3218187d 
interface WithAuthProps { }

export interface WithAuthInjectedProps {
    auth: AuthUserContext
}

export const withAuth = <P extends {}>(
    Component: React.ComponentType<P & WithAuthInjectedProps>,
) => {
    class WithAuth extends React.Component<P & WithAuthProps> {
        render() {
            return (
                <AuthUserConsumer>{(authUserContext: AuthUserContext) => (
                    <Component {...this.props} auth={authUserContext} />
                )}</AuthUserConsumer>
            );
        }
    }

    if (process.env.NODE_ENV !== 'production') {
        (WithAuth as any).displayName = wrapDisplayName(Component, 'hoc')
    }

    return WithAuth
}