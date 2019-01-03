import * as React from 'react'
import { RouteComponentProps } from 'react-router';
import { Button, Container } from 'semantic-ui-react';
import classes from './AssetPage.module.scss';
import FilePicker from '../../../components/FilePicker';
import { withApollo, WithApolloClient, Query } from 'react-apollo';
import { config } from '../../../config';
import { withAuth, WithAuthInjectedProps } from '../../../data/auth';
import gql from 'graphql-tag';

interface Props {
    siteId: string;
}

const GET_ASSETS_FOR_SITE = gql`
    query getAssetsForSite($siteId: String!) {
        site(siteId: $siteId) {
            assets {
                id
                state
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
            fileName
            extension
        }
    }
`

const AssetPage = ({ siteId, client, auth: { user: { token } } }: Props & RouteComponentProps & WithApolloClient<Props> & WithAuthInjectedProps) => <div className={classes.root}>
    <FilePicker handleFilePicked={async (files) => {
        const data = new FormData();
        data.append('file', files[0]);
        data.append('siteId', siteId);
        const xhr = new XMLHttpRequest();

        xhr.upload.addEventListener('progress', e => {
            if (e.lengthComputable) {
                const percentage = Math.round((e.loaded * 100) / e.total);
                console.log(percentage);
            }
        }, false);

        xhr.upload.addEventListener('load', e => {
            const percentage = 100;
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
    }} />

    <Query query={GET_ASSETS_FOR_SITE} variables={{siteId: siteId}}>{({data, loading}) => <div>
        { loading ? <div>loading</div> : data.site.assets.map(asset => <div key={asset.id}>{asset.fileName}</div>)}
    </div>}</Query>
</div>

export default withApollo<Props>(withAuth(AssetPage));