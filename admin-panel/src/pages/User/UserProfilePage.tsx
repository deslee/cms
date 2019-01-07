import React from 'react';
import { RouteComponentProps } from "react-router";
import { Container } from 'semantic-ui-react';
import NavigationMenu from '../Site/NavigationMenu';
import { getUserProfile } from '../../accessors/UserAccessors';
import UserProfileForm from '../../components/UserProfile/UserProfileForm';
import classes from './UserProfilePage.module.scss';
import { UserQuery, withUpdateUser, WithUpdateUserInjectedProps } from '../../common/UserQuery';

interface Props {

}

const UserProfilePage = ({ location: { search }, updateUser }: Props & RouteComponentProps<any> & WithUpdateUserInjectedProps) => {
    const searchParams = new URLSearchParams(search)
    return <UserQuery 
        component={({user}) => <Container>
            <NavigationMenu siteId={searchParams.get('site')} />
            <UserProfileForm
                className={classes.root}
                initialValues={{
                    ...getUserProfile(user),
                    email: user.email
                }}
                handleEditUserProfile={async ({ email, ...userProfile }) => {
                    await updateUser({
                        id: user.id,
                        email: email,
                        data: JSON.stringify(userProfile)
                    })
                }}
            />
        </Container>}
    />
}

export default withUpdateUser(UserProfilePage)