import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import AppBar from '../components/AppBar';

const GET_SITES = gql`
    query getSites {
        sites {
            id
            name
            categories {
                name
                posts {
                    id
                    title
                    slices {
                        type
                        ... on ParagraphSlice {
                            content
                        }
                        ...on ImagesSlice {
                            images
                        }
                        ... on VideoSlice {
                            autoplay
                            loop
                            url
                        }
                    }
                }
            }
        }
    }
`

class DashboardComponent extends React.Component {
    render() {
        return <Query query={GET_SITES}>{(result) => {
            return <div><AppBar /><pre>{JSON.stringify(result.data, null, 2)}</pre></div>
        }}</Query>
    }
}

export default DashboardComponent;