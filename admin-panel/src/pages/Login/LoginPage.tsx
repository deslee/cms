import React from 'react';
import LoginForm from '../../components/Login/LoginForm';
import { RouteComponentProps } from 'react-router';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import { mutateSafely } from '../../data/helpers';
import { withAuth, WithAuthInjectedProps, AuthUser } from '../../data/auth';

const LOGIN = gql`
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

interface Props {

}

const LoginPage = ({ history, auth: {updateUser} } : Props & RouteComponentProps<any> & WithAuthInjectedProps) => 
    <Mutation mutation={LOGIN}>{login => (
        <LoginForm handleLogin={async (loginFormValues) => {
            var result = await mutateSafely(login, 'login', { variables: { login: { email: loginFormValues.email, password: loginFormValues.password } } });
            const authUser: AuthUser = {
                token: result.token
            };
            await updateUser(authUser);

            history.push('/')
        }} />
    )}</Mutation>

export default withAuth(LoginPage);