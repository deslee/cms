import React, { Component } from 'react';
import { AuthUserProvider, AuthUserContext, UpdateAuthUser, AuthUser } from './data/auth';
import { ApolloProvider } from 'react-apollo';
import * as Yup from 'yup';
import { getClient } from './data/apolloClient';
import { BrowserRouter as Router, Route, Link, Redirect, Switch } from "react-router-dom";
import 'semantic-ui-css/semantic.min.css'
import LoginPage from './pages/LoginPage';
import PrivateRoute from './utils/PrivateRoute';
import { AUTH_USER_KEY } from './utils/Constants';
import SiteDashboard from './pages/SiteDashboard';
import Container from './components/Container';

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
            <Container>
              <Switch>
                <PrivateRoute path="/sites/:id/edit" component={SiteDashboard} />
                <Route path="/login" component={LoginPage} />
                <Redirect to={`/sites/${process.env.REACT_APP_SITE_ID}/edit`} />
              </Switch>
            </Container>
          </Router>
        </ApolloProvider>
      </AuthUserProvider>
    );
  }
}

export default App;
