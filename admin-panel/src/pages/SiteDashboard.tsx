import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import SiteComponent from '../components/Sites/SiteComponent';
import AppBar from '../components/AppBar';
import { RouteComponentProps } from 'react-router-dom';

interface Props {

}

const GET_SITE = gql`
    query getSites($siteId: String!) {
        site(siteId: $siteId) {
            id
            name
            title
            subtitle
            googleAnalyticsId
            copyright
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

class SiteDashboard extends React.Component<Props & RouteComponentProps<any>> {
    render() {
        return (
            <div>
                <AppBar />
                <Query query={GET_SITE} variables={{ siteId: this.props.match.params.id }}>{(result) => {
                    if (result.loading) {
                        return <div>Loading...</div>
                    }
                    if (!result.data.site) {
                        return <div>Error</div>
                    }
                    return <SiteComponent {...result.data.site} />
                }}</Query>
            </div>
        )
    }
}

export default SiteDashboard;