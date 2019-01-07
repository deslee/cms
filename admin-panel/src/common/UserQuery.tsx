import * as React from 'react';
import gql from "graphql-tag";
import { Dimmer, Loader } from 'semantic-ui-react';
import { Query, Mutation } from 'react-apollo';
import { mutateSafely } from '../data/helpers';

export interface User {
    id: string;
    email: string;
    data: string;
}

const GET_USER = gql`
    query currentUser {
        me {
            id
            email
            data
        }
    }
`
const UPDATE_USER = gql`
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

export interface UserQueryInjectedProps {
    user: User
}

export interface UserQueryProps {
    component: React.ComponentType<UserQueryInjectedProps>
    loading?: React.ComponentType<any>
    error?: React.ComponentType<any>
}

const DefaultLoading = () => <Dimmer active={true}><Loader /></Dimmer>
const DefaultError = () => <div>Error</div>

export const UserQuery =({component: Component, loading: Loading = DefaultLoading, error: Error = DefaultError}: UserQueryProps) => <Query query={GET_USER}>{({data, loading, error}) => {
    if (loading) {
        return <Loading />
    }
    if (error) {
        return <Error />
    }

    return <Component user={data.me} />
}}</Query>

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