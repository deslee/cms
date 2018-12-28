import React, { Component } from 'react';
import { AuthUserProvider, AuthUserContext, UpdateAuthUser, AuthUser } from './data/auth';
import { ApolloProvider } from 'react-apollo';
import { getClient } from './data/apolloClient';
import AppBar from './components/AppBar';
import 'semantic-ui-css/semantic.min.css'

interface Props { }
interface State {
  authUser: AuthUserContext
}

class App extends Component<Props, State> {

  updateUser: UpdateAuthUser = (user: AuthUser) => {
    this.setState({
      ...this.state,
      authUser: {
        ...this.state.authUser,
        user
      }
    });
  };

  state: State = {
    authUser: {
      updateUser: this.updateUser
    }
  }

  render() {
    const { authUser } = this.state;
    return (
      <AuthUserProvider value={authUser}>
        <ApolloProvider client={getClient(authUser.user && authUser.user.token)}>
          <AppBar />
        </ApolloProvider>
      </AuthUserProvider>
    );
  }
}

export default App;
