import * as React from 'react';
import gql from 'graphql-tag';
import { Query, Mutation } from 'react-apollo';
import { Dimmer, Loader } from 'semantic-ui-react';
import { mutateSafely } from './data/helpers';

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
    component: (props: GetAssetsForSiteQueryInjectedProps) => React.ReactNode
    loading?: () => React.ReactNode
    error?: () => React.ReactNode
}
export const GetAssetsForSiteQuery = ({ siteId, pollInterval, component, loading = DefaultLoading, error = DefaultError }: GetAssetsForSiteQueryProps) => <Query query={GET_ASSETS_FOR_SITE} pollInterval={pollInterval} variables={{ siteId: siteId }}>{({ data, loading: isLoading, error: isError }) => {
    if (isLoading) {
        return loading()
    }
    if (isError) {
        return error()
    }
    return component({assets: data.site.assets.map(mapAsset)})
}}</Query>;

export interface GetAssetQueryInjectedProps {
    asset: Asset
}
export interface GetAssetQueryProps {
    assetId: string
    component: (props: GetAssetQueryInjectedProps) => React.ReactNode
    loading?: () => React.ReactNode
    error?: () => React.ReactNode
}
export const GetAssetQuery = ({ assetId, component, loading = DefaultLoading, error = DefaultError }: GetAssetQueryProps) => <Query query={GET_ASSET} variables={{assetId: assetId}}>{({data, loading: isLoading, error: isError}) => {
    if (isLoading) {
        return loading()
    }
    if (isError) {
        return error()
    }
    return component({asset: mapAsset(data.asset)})
}}</Query>;


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