import React from 'react';
import LoginForm from '../components/LoginForm';
import { withRouter, RouteComponentProps } from 'react-router';
import { AUTH_USER_KEY } from '../utils/Constants';

interface Props {

}

class LoginComponent extends React.Component<Props & RouteComponentProps> {
    render() {
        const { history } = this.props;
        return <div>
            <LoginForm loginSuccess={() => {
                history.push('/dashboard')
            }} />
        </div>
    }
}

export default withRouter(LoginComponent);