import * as React from 'react';
import gql from 'graphql-tag';
import { Query, Mutation } from 'react-apollo';
import { Dimmer, Loader } from 'semantic-ui-react';
import { mutateSafely } from '../data/helpers';

export interface Asset {   
    id: string;
    state: string;
    type: string;
    fileName: string;
    extension: string;
}
function mapAsset(asset: any): Asset {
    return {
        id: asset.id,
        state: asset.state,
        type: asset.type,
        fileName: asset.fileName,
        extension: asset.extension
    }
}

export const GET_ASSETS_FOR_SITE = gql`
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

export const GET_ASSET = gql`
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

export const DELETE_ASSET = gql`
    mutation deleteAsset($assetId: String!) {
        deleteAsset(assetId: $assetId) {
            success
            errorMessage
        }
    }
`

const DefaultLoading = () => <Dimmer active={true}><Loader /></Dimmer>
const DefaultError = () => <div>Error</div>

export interface GetAssetsForSiteQueryInjectedProps {
    assets: Asset[] 
}
export interface GetAssetsForSiteQueryProps {
    siteId: string
    pollInterval?: number;
    component: React.ComponentType<GetAssetsForSiteQueryInjectedProps>
    loading?: React.ComponentType<any>
    error?: React.ComponentType<any>
}
export const GetAssetsForSiteQuery = ({ siteId, pollInterval, component: Component, loading: Loading = DefaultLoading, error: Error = DefaultError }: GetAssetsForSiteQueryProps) => <Query query={GET_ASSETS_FOR_SITE} pollInterval={pollInterval} variables={{ siteId: siteId }}>{({ data, loading, error }) => {
    if (loading) {
        return <Loading />
    }
    if (error) {
        return <Error />
    }
    return <Component assets={data.site.assets.map(mapAsset)} />
}}</Query>

export interface GetAssetQueryInjectedProps {
    asset: Asset
}
export interface GetAssetQueryProps {
    assetId: string
    component: React.ComponentType<GetAssetQueryInjectedProps>
    loading?: React.ComponentType<any>
    error?: React.ComponentType<any>
}
export const GetAssetQuery = ({ assetId, component: Component, loading: Loading = DefaultLoading, error: Error = DefaultError }: GetAssetQueryProps) => <Query query={GET_ASSET} variables={{assetId: assetId}}>{({data, loading, error}) => {
    if (loading) {
        return <Loading />
    }
    if (error) {
        return <Error />
    }
    return <Component asset={mapAsset(data.asset)} />
}}</Query>


export interface WithDeleteAssetInjectedProps {
    deleteAsset: (assetId: string, siteId: string) => Promise<void>
}
export interface WithDeleteAssetProps {}

export const withDeleteAsset = <P extends {}>(
    Component: React.ComponentType<P & WithDeleteAssetInjectedProps>
) => class WithDeleteAsset extends React.Component<P & WithDeleteAssetProps> {
    render() {
        return <Mutation mutation={DELETE_ASSET}>{(deleteAsset) => <Component
            {...this.props}
            deleteAsset={async (assetId, siteId) => {
                await mutateSafely(
                    deleteAsset, 'deleteAsset',
                    { variables: { assetId: assetId }, refetchQueries: () => [{ query: GET_ASSETS_FOR_SITE, variables: { siteId: siteId } }] },
                )
            }}
        />}</Mutation>
    }
}