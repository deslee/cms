import * as React from 'react';
import gql from "graphql-tag";
import { Dimmer, Loader } from 'semantic-ui-react';
import { Query, Mutation } from 'react-apollo';
import { mutateSafely } from './data/helpers';

export interface User {
    id: string;
    email: string;
    data: string;
}

export const GET_USER = gql`
    query currentUser {
        me {
            id
            email
            data
        }
    }
`
export const UPDATE_USER = gql`
    mutation updateUser($user: UserInput!) {
        updateUser(user: $user) {
            success,
            errorMessage,
            data {
                id
                email
                data
            }
        }
    }
`

export const LOGIN = gql`
    mutation Login($login: LoginInput!) {
        login(login: $login) {
            success,
            errorMessage,
            data {
                id
                email
                data
            }
            token
        }
    }
`;


export interface UserQueryInjectedProps {
    user: User
}

export interface UserQueryProps {
    component: (props: UserQueryInjectedProps) => React.ReactNode
    loading?: () => React.ReactNode
    error?: () => React.ReactNode
}

const DefaultLoading = () => <Dimmer active={true}><Loader /></Dimmer>
const DefaultError = () => <div>Error</div>

export const UserQuery =({component, loading = DefaultLoading, error = DefaultError}: UserQueryProps) => <Query query={GET_USER}>{({data, loading: isLoading, error: isError}) => {
    if (isLoading) {
        return loading()
    }
    if (isError) {
        return error()
    }

    return component({user: data.me})
}}</Query>;

export interface WithUpdateUserProps {

}

export interface WithUpdateUserInjectedProps {
    updateUser: (user: User) => Promise<void> 
}

export const withUpdateUser = <P extends {}>(
    Component: React.ComponentType<P & WithUpdateUserInjectedProps> 
) => class WithUpdateUser extends React.Component<P & WithUpdateUserProps> {
    render() {
        return <Mutation mutation={UPDATE_USER}>{(updateUser) => <Component
            {...this.props}
            updateUser={async user => {
                await mutateSafely(updateUser, 'updateUser', {
                    variables: {
                        user: user
                    }
                })
            }}
        />}</Mutation>
    }
}

export interface WithLoginProps {
}
export interface WithLoginInjectedProps {
    login: (username: string, password: string) => Promise<string>
}
export const withLogin = <P extends {}>(
    Component: React.ComponentType<P & WithLoginInjectedProps>
) => class WithLogin extends React.Component<P & WithLoginProps> {
    render() {
        return <Mutation mutation={LOGIN}>{login => <Component 
            {...this.props}
            login={async (email, password) => {
                var result = await mutateSafely(login, 'login', { variables: { login: { email: email, password: password } } });
                return result.token
            }}
        />}</Mutation>
    }
}