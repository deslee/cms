import React from 'react';
import {
    Route,
    Redirect,
    RouteProps
} from "react-router-dom";
import { withAuth, WithAuthInjectedProps } from '../data/auth';

interface Props extends RouteProps {
}

const PrivateRoute = ({ component: Component,
    auth: { user },
    ...rest
}: Props & WithAuthInjectedProps) => <Route
        {...rest}
        render={props =>
            user ? <Component {...props} /> : <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
        }
    />

export default withAuth<Props>(PrivateRoute);