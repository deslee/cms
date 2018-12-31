import React from 'react';
import { RouteComponentProps } from "react-router";
import gql from 'graphql-tag';
import { Dimmer, Loader, Container } from 'semantic-ui-react';
import { Query, Mutation } from 'react-apollo';
import NavigationMenu from '../Site/NavigationMenu';
import { getUserProfile } from '../../accessors/UserAccessors';
import UserProfileForm from '../../components/UserProfile/UserProfileForm';
import { mutateSafely } from '../../data/helpers';

interface Props {

}

const USER_PROFILE_QUERY = gql`
    query currentUser {
        me {
            id
            email
            data
        }
    }
`

const UPDATE_USER_PROFILE = gql`
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

const UserProfilePage = ({ location: { search } }: Props & RouteComponentProps<any>) => {
    const searchParams = new URLSearchParams(search)
    return <Query query={USER_PROFILE_QUERY}>{({ data, loading }) => loading ? <Dimmer active={loading}><Loader /></Dimmer> : <Container>
        <NavigationMenu siteId={searchParams.get('site')} />
        <Mutation mutation={UPDATE_USER_PROFILE}>{updateUserProfile => 
            <UserProfileForm
                initialValues={{
                    ...getUserProfile(data.me),
                    email: data.me.email
                }}
                handleEditUserProfile={async ({ email, ...userProfile }) => {
                    await mutateSafely(updateUserProfile, 'updateUser', {
                        variables: {
                            user: {
                                id: data.me.id,
                                email: email,
                                data: JSON.stringify(userProfile)
                            }
                        }
                    })
                }}
            />
        }</Mutation>
    </Container>}</Query>
}

export default UserProfilePage