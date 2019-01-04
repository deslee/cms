import * as React from 'react'
import { RouteComponentProps, Route, Switch } from 'react-router';
import { Button, Container, Dimmer, Loader, Modal, Progress } from 'semantic-ui-react';
import classes from './AssetPage.module.scss';
import FilePicker from '../../../components/FilePicker';
import { withApollo, WithApolloClient, Query, Mutation } from 'react-apollo';
import { config } from '../../../config';
import { withAuth, WithAuthInjectedProps } from '../../../data/auth';
import gql from 'graphql-tag';
import AssetCollection from '../../../components/Assets/AssetCollection';
import { getAsset, Asset } from '../../../accessors/AssetAccessors';
import AssetView from '../../../components/Assets/AssetView';
import { mutateSafely } from '../../../data/helpers';

interface Props {
    siteId: string;
}

interface State {
    uploadProgress?: number;
}

const GET_ASSETS_FOR_SITE = gql`
    query getAssetsForSite($siteId: String!) {
        site(siteId: $siteId) {
            id
            assets {
                id
                state
                type
                fileName
                extension
            }
        }
    }
`;

const GET_ASSET = gql`
    query getAsset($assetId: String!) {
        asset(assetId: $assetId) {
            id
            state
            type
            fileName
            extension
        }
    }
`

const DELETE_ASSET = gql`
    mutation deleteAsset($assetId: String!) {
        deleteAsset(assetId: $assetId) {
            success
            errorMessage
        }
    }
`

class AssetPage extends React.Component<Props & RouteComponentProps & WithApolloClient<Props> & WithAuthInjectedProps, State> {

    state = {
        uploadProgress: null
    }

    handleFilePicked = async files => {
        const { siteId, auth: { user: { token } }, client } = this.props;

        const data = new FormData();
        data.append('file', files[0]);
        data.append('siteId', siteId);
        const xhr = new XMLHttpRequest();

        xhr.upload.addEventListener('progress', e => {
            if (e.lengthComputable) {
                const percentage = Math.round((e.loaded * 100) / e.total);
                console.log(percentage)
                this.setState({uploadProgress: percentage})
            }
        }, false);

        xhr.upload.addEventListener('load', e => {
            this.setState({ uploadProgress: null })
        })

        xhr.addEventListener('load', e => {
            console.log(xhr.responseText);
            try {
                var response = JSON.parse(xhr.responseText);
                var { site } = client.cache.readQuery({
                    query: GET_ASSETS_FOR_SITE,
                    variables: {
                        siteId: siteId
                    }
                })


                client.query({
                    query: GET_ASSET,
                    variables: {
                        assetId: response.Id
                    }
                }).then(result => {
                    if (!result.loading) {
                        site.assets.unshift(result.data['asset'])
                        client.cache.writeQuery({
                            query: GET_ASSETS_FOR_SITE,
                            variables: {
                                siteId: siteId
                            },
                            data: {
                                site: site
                            }
                        });
                    }
                });

            } catch {

            }
        })

        xhr.open("POST", `${config.backendUrl}/uploadAsset`);
        xhr.setRequestHeader('Authorization', `Bearer ${token}`)

        xhr.send(data);
    }

    render() {
        const { siteId, match: { path, url }, history } = this.props;
        const { uploadProgress } = this.state;

        return <Switch>
            <Route path={`${path}/:assetId`} component={({ match: { params: { assetId } } }) => <Query query={GET_ASSET} variables={{ assetId: assetId }}>{
                ({ data, loading, error }) => {
                    if (loading) {
                        return <Dimmer active={loading}><Loader /></Dimmer>
                    }
                    return <Mutation mutation={DELETE_ASSET}>{deleteAsset => <AssetView asset={getAsset(data.asset)} onDelete={async () => {
                        await mutateSafely(deleteAsset, 'deleteAsset', { variables: { assetId: assetId }, refetchQueries: () => [{ query: GET_ASSETS_FOR_SITE, variables: { siteId: siteId } }] })
                        history.replace(`${url}`);
                    }} />}</Mutation>
                    //
                }
            }</Query>} />
            <Route component={() =>
                <Query query={GET_ASSETS_FOR_SITE} variables={{ siteId: siteId }}>{({ data, loading, error }) => {
                    if (loading) {
                        return <Dimmer active={loading}><Loader /></Dimmer>
                    }
                    return <div>
                        <FilePicker handleFilePicked={this.handleFilePicked} />
                        {uploadProgress != null && <Progress percent={uploadProgress} indicating />}
                        <AssetCollection assets={data.site.assets.map(getAsset)} />
                    </div>
                }}</Query>
            } />
        </Switch>
    }
}

export default withApollo<Props>(withAuth(AssetPage));