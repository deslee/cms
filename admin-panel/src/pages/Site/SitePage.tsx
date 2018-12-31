import * as React from 'react';
import { Switch, Route, withRouter, RouteComponentProps } from "react-router";
import SiteSettingsPage from './SiteSettingsPage';
import classes from './SitePage.module.scss';
import gql from 'graphql-tag';
import NavigationMenu from './NavigationMenu';

interface Props { }

interface RouteParams {
    siteId: string
}

const SitePage = ({
    match: { params: { siteId } }
}: Props & RouteComponentProps<RouteParams>) =>
    <div>
        <NavigationMenu siteId={siteId} />
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

export default withRouter(SitePage);