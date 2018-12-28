import * as React from 'react'
import LoginForm from './LoginForm';
import { withAuth, WithAuthInjectedProps, AuthUser } from '../data/auth';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { mutateSafely } from '../data/helpers';
import { Button, Menu, Dropdown, Icon, Header } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

interface Props {

}

const LOGIN = gql`
    mutation Login($login: LoginInput!) {
        login(login: $login) {
            success,
            errorMessage,
            data {
                id
                email
                name
            }
            token
        }
    }
`;

class AppBar extends React.Component<Props & WithAuthInjectedProps> {
    render() {
        const {
            auth: { user, updateUser }
        } = this.props;

        return (
            <Menu size="large">
                <Menu.Item link as={Link} to="/sites">
                    Dashboard
                </Menu.Item>
                <Menu.Menu position="right">
                    <Dropdown item text={user.name}>
                        <Dropdown.Menu>
                            <Dropdown.Item text="Sign out" onClick={() => updateUser()}></Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </Menu.Menu>
            </Menu>
        )
    }
}

export default withAuth(AppBar);