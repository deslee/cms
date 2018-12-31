import React from 'react';
import LoginForm from '../components/Login/LoginForm';
import { RouteComponentProps } from 'react-router';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import { mutateSafely } from '../data/helpers';
import { withAuth, WithAuthInjectedProps, AuthUser } from '../data/auth';

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

interface Props {

}

class LoginPage extends React.Component<Props & RouteComponentProps<any> & WithAuthInjectedProps> {
    render() {
        const { history, auth: { updateUser } } = this.props;
        return <Mutation mutation={LOGIN}>{login => (
            <LoginForm handleLogin={async (loginFormValues) => {
                var result = await mutateSafely(login, 'login', { variables: { login: { email: loginFormValues.email, password: loginFormValues.password } } });
                const authUser: AuthUser = {
                    email: result.data.email,
                    name: result.data.name,
                    token: result.token
                };
                await updateUser(authUser);

                history.push('/')
            }} />
        )}</Mutation>
    }
}

export default withAuth(LoginPage);