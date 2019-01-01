import React from 'react';
import LoginForm from '../../components/Login/LoginForm';
import { RouteComponentProps } from 'react-router';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import { mutateSafely } from '../../data/helpers';
import { withAuth, WithAuthInjectedProps, AuthUser } from '../../data/auth';
import { Grid, Header, Message, Segment } from 'semantic-ui-react';
import classes from './LoginPage.module.scss';

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
        <Grid textAlign='center' className={classes.grid} verticalAlign='middle'>
            <Grid.Column className={classes.column}>
                <Header as='h2' textAlign='center'>
                    Log-in to your account
                </Header>
                <Segment>
                    <LoginForm handleLogin={async (loginFormValues) => {
                        var result = await mutateSafely(login, 'login', { variables: { login: { email: loginFormValues.email, password: loginFormValues.password } } });
                        const authUser: AuthUser = {
                            token: result.token
                        };
                        await updateUser(authUser);

                        history.push('/')
                    }} />
                </Segment>
                <Message>
                    New to us? <a href='#'>Sign Up</a>
                </Message>
            </Grid.Column>
        </Grid>
    )}</Mutation>

export default withAuth(LoginPage);