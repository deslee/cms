import * as React from 'react';
import { Menu, Icon, Dropdown } from "semantic-ui-react";
import { Link, withRouter, RouteComponentProps } from "react-router-dom";
import { withAuth, WithAuthInjectedProps } from "../../data/auth";
import gql from "graphql-tag";
import { Query } from "react-apollo";
import { getUserProfile } from '../../accessors/UserAccessors';

interface Props {
    siteId: string;
}

const USER_PROFILE_QUERY = gql`
    query currentUser {
        me {
            id
            data
        }
    }
`

const NavigationMenu = ({ siteId, location: { pathname }, auth: { updateUser } }: Props & WithAuthInjectedProps & RouteComponentProps) =>
    <Menu size="large" pointing fluid>
        <Menu.Item as={Link} to={`/sites/${siteId}/`} active={/\/sites\/.+\/$/.test(pathname)}>
            <Icon name='browser' />
            Dashboard
            </Menu.Item>
        <Menu.Item as={Link} to={`/sites/${siteId}/pages`} active={/\/sites\/.+\/pages/.test(pathname)}>
            <Icon name='file' />
            Pages
            </Menu.Item>
        <Menu.Item as={Link} to={`/sites/${siteId}/posts`} active={/\/sites\/.+\/posts/.test(pathname)}>
            <Icon name='pencil' />
            Posts
            </Menu.Item>
        <Menu.Item as={Link} to={`/sites/${siteId}/assets`} active={/\/sites\/.+\/assets/.test(pathname)}>
            <Icon name='file image' />
            Assets
            </Menu.Item>
        <Menu.Item as={Link} to={`/sites/${siteId}/settings`} active={/\/sites\/.+\/settings/.test(pathname)}>
            <Icon name='setting' />
            Settings
            </Menu.Item>
        <Menu.Menu position="right">
            <Query query={USER_PROFILE_QUERY}>{({loading, data}) => loading? <div /> : 
                <Dropdown item text={getUserProfile(data.me).name}>
                    <Dropdown.Menu>
                        <Dropdown.Item as={Link} to={`/user/profile?site=${siteId}`} text="Profile"></Dropdown.Item>
                        <Dropdown.Item text="Sign out" onClick={() => updateUser()}></Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            }</Query>

        </Menu.Menu>
    </Menu>

export default withRouter(withAuth(NavigationMenu));