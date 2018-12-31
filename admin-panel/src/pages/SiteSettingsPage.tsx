import React from 'react';
import gql from 'graphql-tag';
import { Query, Mutation } from 'react-apollo';
import { RouteComponentProps } from 'react-router-dom';
import { Dimmer, Loader, Container } from 'semantic-ui-react';
import { mutateSafely } from '../data/helpers';
import SiteDataForm from '../components/Sites/SiteDataForm';

interface Props {

}

const GET_SITE = gql`
    query getSiteSettings($siteId: String!) {
        site(siteId: $siteId) {
            id
            name
            data
        }
    }
`

const UPSERT_SITE = gql`
    mutation upsertSiteSettings($site: SiteInput!) {
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

export default ({ match: { params: { siteId }} }: Props & RouteComponentProps<any>) => 
    <Container>
        <Query query={GET_SITE} variables={{ siteId: siteId }}>{(result) => {
            const site = result.data.site;
            const siteSettings = site && JSON.parse(site.data)
            return <div style={{ width: '100%', height: '100%' }}>
                <Dimmer
                    active={result.loading}
                >
                    <Loader />
                </Dimmer>
                {
                    !result.loading &&
                    <Mutation
                        mutation={UPSERT_SITE}
                    >{(upsertSite) => (
                        <SiteDataForm
                            initialValues={{
                                title: siteSettings.title,
                                subtitle: siteSettings.subtitle,
                                copyright: siteSettings.copyright,
                                googleAnalyticsId: siteSettings.googleAnalyticsId
                            }}
                            handleEditSite={async (values) => {
                                await mutateSafely(upsertSite, 'upsertSite', {
                                    variables: {
                                        site: {
                                            id: site.id,
                                            name: site.name,
                                            data: JSON.stringify(values)
                                        }
                                    }
                                })
                            }}
                        />
                    )}</Mutation>
                }
            </div>
        }}</Query>
    </Container>