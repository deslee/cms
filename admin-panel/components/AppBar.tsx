import * as React from 'react'
import { withApi, WithApiInjectedProps } from "../data/api";
import { withAuth, WithAuthInjectedProps } from "../data/auth";

interface Props {

}


class AppBar extends React.Component<Props & WithApiInjectedProps & WithAuthInjectedProps> {
    render() {
        const {
            auth: { user, updateUser }, api
        } = this.props;

        return (
            <div>
                {user && <div>I AM: {user.name} AND YOU CAN REACH ME AT {user.email}</div>}
            </div>
        )
    }
}

export default withApi(withAuth(AppBar));