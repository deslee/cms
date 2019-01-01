import React from 'react';
import gql from 'graphql-tag';
import { Query, Mutation } from 'react-apollo';
import { RouteComponentProps } from 'react-router-dom';
import { Dimmer, Loader, Container } from 'semantic-ui-react';
import { mutateSafely } from '../../data/helpers';
import SiteDataForm from '../../components/Sites/SiteDataForm';
import { getSiteSettings } from '../../accessors/SiteAccessors';
import classes from './SiteSettingsPage.module.scss';

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
    <Container className={classes.root}>
        <Query query={GET_SITE} variables={{ siteId: siteId }}>{({ data, loading }) => {
            const site = data.site;
            return loading ? <Dimmer active={loading}><Loader /></Dimmer> : <div>
                {site ? <Mutation
                    mutation={UPSERT_SITE}
                >{(upsertSite) => (
                    <SiteDataForm
                        initialValues={getSiteSettings(site)}
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
                )}</Mutation> : <div>not found</div>}
            </div>
        }}</Query>
    </Container>