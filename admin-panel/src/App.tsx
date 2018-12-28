import React, { Component } from 'react';
import { AuthUserProvider, AuthUserContext, UpdateAuthUser, AuthUser } from './data/auth';
import { ApolloProvider } from 'react-apollo';
import * as Yup from 'yup';
import { getClient } from './data/apolloClient';
import { BrowserRouter as Router, Route, Link, Redirect, Switch } from "react-router-dom";
import AppBar from './components/AppBar';
import 'semantic-ui-css/semantic.min.css'
import SiteListingPage from './pages/SiteListingPage';
import LoginPage from './pages/LoginPage';
import PrivateRoute from './utils/PrivateRoute';
import { AUTH_USER_KEY } from './utils/Constants';

interface Props { }
interface State {
  authUser: AuthUserContext
}

let initialUser: AuthUser | undefined;
try {
  const authUserSchema = Yup.object().shape({
    email: Yup.string()
      .required("Required"),
    name: Yup.string()
      .required("Required"),
    token: Yup.string()
      .required("Required")
  })

  var parsed = JSON.parse(localStorage.getItem(AUTH_USER_KEY));
  initialUser = authUserSchema.validateSync(parsed) as AuthUser;
} catch (e) {
  console.log("json parsing error: ")
  console.error(e);
  localStorage.removeItem(AUTH_USER_KEY);
}

class App extends Component<Props, State> {
  updateUser: UpdateAuthUser = (user: AuthUser) => {
    if (user) {
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_USER_KEY);
    }
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
      user: initialUser,
      updateUser: this.updateUser
    }
  }

  render() {
    const { authUser } = this.state;
    return (
      <AuthUserProvider value={authUser}>
        <ApolloProvider client={getClient(authUser.user && authUser.user.token)}>
          <Router>
            <Switch>
              <PrivateRoute path="/sites" component={SiteListingPage} />
              <Route path="/login" component={LoginPage} />
              <Redirect to="/sites" />
            </Switch>
          </Router>
        </ApolloProvider>
      </AuthUserProvider>
    );
  }
}

export default App;
