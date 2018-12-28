import React, { Component } from 'react';
import {
    BrowserRouter as Router,
    Route,
    Link,
    Redirect,
    withRouter,
    RouteComponentProps,
    RouteProps
} from "react-router-dom";
import { withAuth, WithAuthInjectedProps } from '../data/auth';

interface Props extends RouteProps {
}

class PrivateRouteComponent extends React.Component<Props & WithAuthInjectedProps> {
    render() {
        const {
            component: Component,
            auth,
            ...rest
        } = this.props;
        return (
            <Route
                {...rest}
                render={props => auth.user ? (<Component {...props} />) : (<Redirect to={{ pathname: '/login', state: { from: props.location } }} />)}
            />
        )
    }
}

export default withAuth<Props>(PrivateRouteComponent);