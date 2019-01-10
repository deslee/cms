import * as React from 'react';
import { Switch, Route, withRouter, RouteComponentProps } from "react-router";
import SiteSettingsPage from './Settings/SiteSettingsPage';
import classes from './SitePage.module.scss';
import gql from 'graphql-tag';
import NavigationMenu from './NavigationMenu';
import AssetPage from './Assets/AssetPage';
import SitePostsPage from './Posts/SitePostsPage';

interface Props { }

interface RouteParams {
    siteId: string
}

const SitePage = ({
    match: { params: { siteId } }
}: Props & RouteComponentProps<RouteParams>) =>
    <div className={classes.root}>
        <NavigationMenu siteId={siteId} />
        <div className={classes.children}>
            <Switch>
                <Route exact path="/sites/:siteId/" component={() => <div>Dashboard</div>} />
                <Route path="/sites/:siteId/pages" component={() => <div>Pages</div>} />
                <Route path="/sites/:siteId/posts" component={props => <SitePostsPage {...props} siteId={siteId} />} />
                <Route path="/sites/:siteId/assets" component={props => <AssetPage siteId={siteId} {...props} />} />
                <Route path="/sites/:siteId/settings" component={SiteSettingsPage} />
            </Switch>
        </div>
    </div>

export default withRouter(SitePage);