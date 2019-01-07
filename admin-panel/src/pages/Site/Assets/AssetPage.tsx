import * as React from 'react'
import { RouteComponentProps, Route, Switch } from 'react-router';
import { Button, Container, Dimmer, Loader, Modal, Progress } from 'semantic-ui-react';
import FilePicker from '../../../components/FilePicker';
import { withApollo, WithApolloClient } from 'react-apollo';
import { withAuth, WithAuthInjectedProps } from '../../../data/auth';
import AssetCollection from '../../../components/Assets/AssetCollection';
import AssetView from '../../../components/Assets/AssetView';
import { mutateSafely } from '../../../data/helpers';
import { GetAssetsForSiteQuery, GetAssetQuery, withDeleteAsset, WithDeleteAssetInjectedProps, GET_ASSETS_FOR_SITE, GET_ASSET } from '../../../common/AssetQuery';

interface Props {
    siteId: string;
}

interface State {
    uploadProgress?: number;
}


class AssetPage extends React.Component<Props & RouteComponentProps & WithApolloClient<Props> & WithAuthInjectedProps & WithDeleteAssetInjectedProps, State> {
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

        xhr.open("POST", `${process.env.REACT_APP_BACKEND_URL}/uploadAsset`);
        xhr.setRequestHeader('Authorization', `Bearer ${token}`)

        xhr.send(data);
    }

    render() {
        const { siteId, match: { path, url }, history, deleteAsset } = this.props;
        const { uploadProgress } = this.state;

        return <Switch>
            <Route path={`${path}/:assetId`} component={({ match: { params: { assetId } } }) => <GetAssetQuery assetId={assetId} 
                component={({ asset }) => 
                    <AssetView asset={asset} onDelete={async () => {
                        await deleteAsset(assetId, siteId);
                        history.replace(`${url}`);
                    }} />
                }/>} />
            />}/>
            
            <Route component={() =>
                <GetAssetsForSiteQuery
                    siteId={siteId}
                    pollInterval={1000}
                    component={({assets}) => <div>
                        <FilePicker handleFilePicked={this.handleFilePicked} />
                        {uploadProgress != null && <Progress percent={uploadProgress} indicating />}
                        <AssetCollection assets={assets} />
                    </div>}
                />
            } />
        </Switch>
    }
}

export default withApollo<Props>(withAuth(withDeleteAsset(AssetPage)));