import React from 'react';
import {
    Route,
    Redirect,
    RouteProps
} from "react-router-dom";
import { withAuth, WithAuthInjectedProps } from '../common/data/auth';
import { UserQuery } from '../common/UserQuery';

interface Props extends RouteProps {
}

const RedirectToLogin = ({ from }: { from: any }) => <Redirect to={{ pathname: '/login', state: { from: from } }} />;

const PrivateRoute = ({ component: Component, auth: { user }, ...rest }: Props & WithAuthInjectedProps) => <Route
    {...rest}
    render={routeComponentProps => {
        if (!user) {
            return <RedirectToLogin from={routeComponentProps.location} />
        }

        return <UserQuery
            component={({ user }) => {
                if (!user) {
                    return <RedirectToLogin from={routeComponentProps.location} />
                }

                return <Component {...routeComponentProps} />
            }}
        />
    }}
/>

export default withAuth<Props>(PrivateRoute);