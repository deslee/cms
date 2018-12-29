import React from 'react';
import gql from 'graphql-tag';
import { Query, withQuery } from 'react-apollo';
import SiteComponent from '../components/Sites/SiteComponent';
import { RouteComponentProps } from 'react-router-dom';
import { Site } from '../models/models';
import { Segment as div, Dimmer, Loader } from 'semantic-ui-react';
import { QueryInjectedProps, withSiteQuery } from '../data/queries';

const GET_SITE = `
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

interface Props {

}

class SiteDashboard extends React.Component<Props & QueryInjectedProps<any, any>> {
    render() {
        const { result: { loading, data } } = this.props;
        console.log(this.props)
        return (
            <div style={{ width: '100%', height: '100%' }}>
                <Dimmer
                    active={loading}
                >
                    <Loader />
                </Dimmer>
                {!loading && data && <SiteComponent site={data.site} />}
            </div>
        )
    }
}

const SiteQuery = withSiteQuery({ query: GET_SITE })<Props>(SiteDashboard)

export default ({ match: { params: { id } } }: {} & RouteComponentProps<any>) => <SiteQuery variables={{ siteId: id }} />