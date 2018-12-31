import React from 'react';
import {
    Route,
    Redirect,
    RouteProps
} from "react-router-dom";
import { withAuth, WithAuthInjectedProps } from '../data/auth';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

interface Props extends RouteProps {
}

const USER_PROFILE_QUERY = gql`
    query currentUser {
        me {
            id
            data
        }
    }
`

const RedirectToLogin = ({ from }: { from: any }) => <Redirect to={{ pathname: '/login', state: { from: from } }} />;

const PrivateRoute = ({ component: Component, auth: { user }, ...rest }: Props & WithAuthInjectedProps) => <Route
    {...rest}
    render={routeComponentProps => {
        if (!user) {
            return <RedirectToLogin from={routeComponentProps.location} />
        }

        return <Query query={USER_PROFILE_QUERY}>{({ loading, data }) => {
            if (loading) {
                return <div />
            }

            if (!data.me) {
                return <RedirectToLogin from={routeComponentProps.location} />
            }
            
            return <Component {...routeComponentProps} />
        }}</Query>
    }
    }
/>

export default withAuth<Props>(PrivateRoute);