import * as React from 'react';
import gql from 'graphql-tag';
import { Query, Mutation } from 'react-apollo';
import { Dimmer, Loader } from 'semantic-ui-react';
import { mutateSafely } from '../data/helpers';

const GET_SITE = gql`
    query getSite($siteId: String!) {
        site(siteId: $siteId) {
            id
            name
            data
        }
    }
`

const UPSERT_SITE = gql`
    mutation upsertSite($site: SiteInput!) {
        upsertSite(site: $site) {
            success
            errorMessage
            data {
                id
                name
                data
            }
        }
    }
`

export interface SiteQueryInjectedProps {
    site: any // TODO: make type
}

export interface SiteQueryProps {
    siteId: string;
    component: React.ComponentType<SiteQueryInjectedProps>
    loading?: React.ComponentType<any>
    error?: React.ComponentType<any>
}

const DefaultLoading = () => <Dimmer active={true}><Loader /></Dimmer>
const DefaultError = () => <div>Error</div>

export const SiteQuery = ({ siteId, component: Component, loading: Loading = DefaultLoading, error: Error = DefaultError }: SiteQueryProps) => <Query query={GET_SITE} variables={{ siteId: siteId }}>{({data, loading, error}) => {
    if (loading){
        return <Loading />
    }
    if (error){
        return <Error />
    }

    return <Component site={data.site} />
}}</Query>

export interface UpsertSiteInjectedProps {
    upsertSite: (site: any) => Promise<void> // TODO: make type
}

export interface UpsertSiteProps {
    component: React.ComponentType<UpsertSiteInjectedProps>
}

export const UpsertSite = ({ component: Component }: UpsertSiteProps) => <Mutation mutation={UPSERT_SITE}>{(upsertSite) => <Component
    upsertSite={async site => {
        await mutateSafely(upsertSite, 'upsertSite', {
            variables: {
                site: site
            }
        })
    }}
/>}</Mutation>