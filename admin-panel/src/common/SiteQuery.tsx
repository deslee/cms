import * as React from 'react';
import gql from 'graphql-tag';
import { Query, Mutation } from 'react-apollo';
import { Dimmer, Loader } from 'semantic-ui-react';
import { mutateSafely } from './data/helpers';

export interface Site {
    id: string;
    name: string;
    data: string;
}

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
    site: Site
}

export interface SiteQueryProps {
    siteId: string;
    component: (data: SiteQueryInjectedProps) => React.ReactNode;
    loading?: () => React.ReactNode;
    error?: () => React.ReactNode;
}

const DefaultLoading = () => <Dimmer active={true}><Loader /></Dimmer>
const DefaultError = () => <div>Error</div>

export const SiteQuery = ({ siteId, component, loading = DefaultLoading, error = DefaultError }: SiteQueryProps) => <Query query={GET_SITE} variables={{ siteId: siteId }}>{({ data, loading: isLoading, error: isError }) => {
    if (isLoading) {
        return loading()
    }
    if (isError) {
        return error()
    }

    return component({ site: data.site});
}}</Query>

export interface WithUpsertSiteInjectedProps {
    upsertSite: (site: Site) => Promise<void> 
}

export interface WithUpsertSiteProps { }

export const withUpsertSite = <P extends {}>(
    Component: React.ComponentType<P & WithUpsertSiteInjectedProps>
) => class WithUpsertSite extends React.Component<P & WithUpsertSiteProps> {
        render() {
            return <Mutation mutation={UPSERT_SITE}>{(upsertSite) => <Component
                {...this.props}
                upsertSite={async site => {
                    await mutateSafely(upsertSite, 'upsertSite', {
                        variables: {
                            site: site
                        }
                    })
                }}
            />}</Mutation>
        }
    }