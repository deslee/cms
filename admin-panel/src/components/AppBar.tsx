import * as React from 'react'
import LoginForm from './LoginForm';
import { withAuth, WithAuthInjectedProps, AuthUser } from '../data/auth';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { mutateSafely } from '../data/helpers';

interface Props {

}

const LOGIN = gql`
    mutation Login($login: LoginInput!) {
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
`;

class AppBar extends React.Component<Props & WithAuthInjectedProps> {
    render() {
        const {
            auth: { user, updateUser }
        } = this.props;

        return (
            <div>
                {!user ?
                    <LoginForm /> :
                    <div>I AM: {user.name} AND YOU CAN REACH ME AT {user.email}</div>}
            </div>
        )
    }
}

export default withAuth(AppBar);