import * as React from 'react';
import gql from 'graphql-tag';
import { Query, Mutation } from 'react-apollo';
import { Dimmer, Loader } from 'semantic-ui-react';
import { mutateSafely } from './data/helpers';

export interface Item {
    id: string;
    data: string;
    type: string;
}
export interface ItemInput {
    id?: string;
    groups: string[];
    type: string;
    data: string;
}

const GET_ITEMS_FOR_SITE = gql`
    query getItemsForSite($siteId: String!) {
        items(siteId: $siteId) {
            id
            data
            type
        }
    }
`

const UPSERT_ITEM = gql`
    mutation upsertItem($item: ItemInput!, $siteId: String!) {
        upsertItem(item: $item, siteId: $siteId) {
            success
            errorMessage
            data {
                id
                data
                type
            }
        }
    }
`

export interface SiteItemsQueryInjectedProps {
    items: Item[]
}

export interface SiteItemsQueryProps {
    siteId: string;
    component: (data: SiteItemsQueryInjectedProps) => React.ReactNode;
    loading?: () => React.ReactNode;
    error?: () => React.ReactNode;
}

const DefaultLoading = () => <Dimmer active={true}><Loader /></Dimmer>
const DefaultError = () => <div>Error</div>

export const SiteItemsQuery = ({ siteId, component, loading = DefaultLoading, error = DefaultError }: SiteItemsQueryProps) => <Query query={GET_ITEMS_FOR_SITE} variables={{ siteId: siteId }}>{({ data, loading: isLoading, error: isError }) => {
    if (isLoading) {
        return loading()
    }
    if (isError) {
        return error()
    }

    return component({ items: data.items });
}}</Query>

export interface WithUpsertItemInjectedProps {
    upsertItem: (item: ItemInput, siteId: string) => Promise<void>
}

export interface WithUpsertItemProps {}

export const withUpsertItem = <P extends {}>(
    Component: React.ComponentType<P & WithUpsertItemInjectedProps>
) => class WithUpsertItem extends React.Component<P & WithUpsertItemProps> {
    render() {
        return <Mutation mutation={UPSERT_ITEM}>{(upsertItem) => <Component 
            {...this.props}
            upsertItem={async (item, siteId) => {
                await mutateSafely(upsertItem, 'upsertItem', {
                    variables: {
                        item: item,
                        siteId: siteId
                    }
                })
            }}
        />}</Mutation>
    }
}