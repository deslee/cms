import * as React from 'react'
import LoginForm, { LoginFormValues } from './LoginForm';
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
                    <Mutation mutation={LOGIN}>
                        {(mutate) => (
                            <LoginForm
                                handleLogin={async (credentials) => {
                                    var response = await mutateSafely(mutate, { variables: { login: { email: credentials.email, password: credentials.password } } });
                                    let result = response && response.data.login;
                                    if (!result.success) {
                                        throw new Error(result.errorMessage || "Failed login");
                                    }
                                    const authUser: AuthUser = {
                                        email: result.data.email,
                                        name: result.data.name,
                                        token: result.token
                                    };
                                    await updateUser(authUser);
                                }} />
                        )}
                    </Mutation> :
                    <div>I AM: {user.name} AND YOU CAN REACH ME AT {user.email}</div>}
            </div>
        )
    }
}

export default withAuth(AppBar);