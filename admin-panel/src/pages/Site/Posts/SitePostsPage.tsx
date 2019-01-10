import * as React from 'react'
import classes from './SitePostsPage.module.scss'
import { Button, Container } from 'semantic-ui-react';
import { RouteComponentProps, Switch, Route } from 'react-router';
import { Link } from 'react-router-dom';
import NewPostPage from './NewPostPage';
import { SiteItemsQuery } from '../../../common/ItemQuery';
import { getPost } from '../../../accessors/PostAccessors';

interface PostListsProps {
    siteId: string
}

class PostsList extends React.Component<PostListsProps & RouteComponentProps> {
    render() {
        const {
            siteId,
            match: { url }
        } = this.props;

        return <SiteItemsQuery
            siteId={siteId}
            component={({items}) => {
                return <div>
                    <Button as={Link} to={`${url}/new`}>New</Button>
                    {items && items.map(i => getPost(i).title)}
                </div>
            }}
        />
    }
}

interface SitePostsPageProps {
    siteId: string
}

class SitePostsPage extends React.Component<SitePostsPageProps & RouteComponentProps> {
    render() {
        const {
            match: { url, path },
            siteId
        } = this.props;

        return <Container className={classes.root}>
            <Switch>
                <Route path={url} exact={true} component={props => <PostsList {...props} siteId={siteId} />} />
                <Route path={`${url}/new`} exact={true} component={props => <NewPostPage {...props} siteId={siteId} />} />
            </Switch>
        </Container>
    }
}

export default SitePostsPage