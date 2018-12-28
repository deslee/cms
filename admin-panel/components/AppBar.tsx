import * as React from 'react'
import { withApi, WithApiInjectedProps } from "../data/api";
import LoginForm, { LoginFormValues } from './LoginForm';

interface Props {

}

class AppBar extends React.Component<Props & WithApiInjectedProps> {

    handleLogin = async (credentials: LoginFormValues) => {
        const {
            auth: { updateUser }, api
        } = this.props;
        
        var user = await api.login({ email: credentials.email, password: credentials.password });
        updateUser(user);
    }

    render() {
        const {
            auth: { user }
        } = this.props;

        return (
            <div>
                {!user ? <LoginForm handleLogin={this.handleLogin} /> : <div>I AM: {user.name} AND YOU CAN REACH ME AT {user.email}</div>}
            </div>
        )
    }
}

export default withApi(AppBar);