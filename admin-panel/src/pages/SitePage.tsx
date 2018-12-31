import * as React from 'react';
import { Switch, Route, withRouter, RouteComponentProps } from "react-router";
import SiteSettingsPage from './SiteSettingsPage';
import { withAuth, WithAuthInjectedProps } from '../data/auth';
import { Menu, Icon, Dropdown } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import classes from './SitePage.module.scss';

interface Props { }

interface RouteParams {
    siteId: string
}

const SitePage = ({
    auth: { user, updateUser },
    location: { pathname },
    match: { params: { siteId } }
}: Props & WithAuthInjectedProps & RouteComponentProps<RouteParams>) =>
    <div>
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
                {user &&
                    <Dropdown item text={user.name}>
                        <Dropdown.Menu>
                            <Dropdown.Item text="Sign out" onClick={() => updateUser()}></Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                }
            </Menu.Menu>
        </Menu>
        <div className={classes.children}>
            <Switch>
                <Route exact path="/sites/:siteId/" component={() => <div>Dashboard</div>} />
                <Route path="/sites/:siteId/pages" component={() => <div>Pages</div>} />
                <Route path="/sites/:siteId/posts" component={() => <div>Posts</div>} />
                <Route path="/sites/:siteId/assets" component={() => <div>Assets</div>} />
                <Route path="/sites/:siteId/settings" component={SiteSettingsPage} />
            </Switch>
        </div>
    </div>

export default withRouter(withAuth(SitePage));