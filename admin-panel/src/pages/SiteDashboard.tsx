import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import SiteComponent from '../components/Sites/SiteComponent';
import AppBar from '../components/AppBar';

interface Props {

}

const GET_SITE = gql`
    query getSites($siteId: String!) {
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

class SiteDashboard extends React.Component<Props> {
    render() {
        return (
            <div>
                <AppBar />
                <Query query={GET_SITE} variables={{ siteId: process.env.REACT_APP_SITE_ID }}>{(result) => {
                    if (result.loading) {
                        return <div>Loading...</div>
                    }
                    return <SiteComponent {...result.data.site} />
                }}</Query>
            </div>
        )
    }
}

export default SiteDashboard;