import * as React from 'react'
import App, { Container } from 'next/app'
import { AuthUserProvider, AuthUserContext } from '../data/auth';

interface State {
    authUser: AuthUserContext
}

class ContentAdminApp extends App {
    updateUser = (user: any) => {
        this.setState({
            authUser: {
                user
            }
        })
    };

    state: State = {
        authUser: {
            updateUser: this.updateUser
        }
    }

    render() {
        const { Component, pageProps } = this.props;

        return (
            <Container>
                <AuthUserProvider value={this.state.authUser}>
                    <Component {...pageProps} />
                </AuthUserProvider>
            </Container>
        )
    }
}

export default ContentAdminApp;