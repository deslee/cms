import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import AppBar from '../components/AppBar';
import SiteList from '../components/Sites/SiteList'
import { RouteComponentProps, Route } from 'react-router-dom';
import SiteComponent from '../components/Sites/SiteComponent';

const GET_SITES = gql`
    query getSites {
        sites {
            id
            name
        }
    }
`

const GET_SITE = gql`
    query getSite($siteId: String!) {
        site(siteId: $siteId) {
            id
            name
            posts {
                id
                title
                slices {
                    type
                    ... on ParagraphSlice {
                        content
                    }
                    ... on VideoSlice {
                        url
                        autoplay
                        loop
                    }
                    ... on ImagesSlice {
                        images
                    }
                }
            }            
        }
    }
`

interface Props {

}

class SiteListingComponent extends React.Component<Props & RouteComponentProps<any>> {
    render() {
        const {
            match
        } = this.props;
        return <Query query={GET_SITES}>{(result) => {
            return <div>
                <AppBar />
                {result.loading ? <div>Loading...</div> : <SiteList sites={result.data.sites} />}
                <Route path={`${match.path}/:id`} render={({ match: { params: { id: siteId } } }) => <Query query={GET_SITE} variables={{siteId}}>{(result) => {
                    if (result.loading) {
                        return <div>Loading site...</div>
                    } else {
                        return <SiteComponent {...result.data.site} />
                    }
                }}</Query>} />
            </div>
        }}</Query>
    }
}

export default SiteListingComponent;