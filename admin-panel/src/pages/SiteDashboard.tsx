import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import SiteComponent from '../components/Sites/SiteComponent';
import { RouteComponentProps } from 'react-router-dom';
import { Site } from '../models/models';
import { Segment as div, Dimmer, Loader } from 'semantic-ui-react';

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
            <Query query={GET_SITE} variables={{ siteId: this.props.match.params.id }}>{(result) => {
                const site: Site = result.data.site;
                return <div style={{width: '100%', height: '100%'}}>
                    <Dimmer
                        active={result.loading}
                    >
                        <Loader />
                    </Dimmer>
                    {!result.loading && <SiteComponent site={site} />}
                </div>
            }}</Query>
        )
    }
}

export default SiteDashboard;