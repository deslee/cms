import * as React from 'react';
import { Menu, Icon, Dropdown } from "semantic-ui-react";
import { Link, withRouter, RouteComponentProps } from "react-router-dom";
import { getUserProfile } from '../../accessors/UserAccessors';
import classes from './NavigationMenu.module.scss';
import { UserQuery } from '../../common/UserQuery';
import { WithAuthInjectedProps, withAuth } from '../../common/data/auth';

interface Props {
    siteId: string;
}

const NavigationMenu = ({ siteId, location: { pathname }, auth: { updateUser } }: Props & WithAuthInjectedProps & RouteComponentProps) =>
    <Menu fixed='top' size="large" fluid className={classes.menu}>
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
            <UserQuery 
                component={({user}) => <Dropdown item text={getUserProfile(user).name}>
                    <Dropdown.Menu>
                        <Dropdown.Item as={Link} to={`/user/profile?site=${siteId}`} text="Profile"></Dropdown.Item>
                        <Dropdown.Item text="Sign out" onClick={() => updateUser()}></Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>}
            />
        </Menu.Menu>
    </Menu>

export default withRouter(withAuth(NavigationMenu));