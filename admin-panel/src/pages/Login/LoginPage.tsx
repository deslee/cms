import React from 'react';
import LoginForm from '../../components/Login/LoginForm';
import { RouteComponentProps } from 'react-router';
import { Grid, Header, Message, Segment } from 'semantic-ui-react';
import classes from './LoginPage.module.scss';
import { withLogin, WithLoginInjectedProps } from '../../common/UserQuery';
import { WithAuthInjectedProps, AuthUser, withAuth } from '../../common/data/auth';

interface Props {

}

const LoginPage = ({ history, auth: {updateUser}, login } : Props & RouteComponentProps<any> & WithAuthInjectedProps & WithLoginInjectedProps) => 
    <Grid textAlign='center' className={classes.grid} verticalAlign='middle'>
        <Grid.Column className={classes.column}>
            <Header as='h2' textAlign='center'>
                Log-in to your account
                </Header>
            <Segment>
                <LoginForm handleLogin={async (loginFormValues) => {
                    var token = await login(loginFormValues.email, loginFormValues.password);
                    const authUser: AuthUser = {
                        token: token
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

export default withAuth(withLogin(LoginPage));