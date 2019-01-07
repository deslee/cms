import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Container } from 'semantic-ui-react';
import SiteDataForm from '../../../components/Sites/SiteDataForm';
import { getSiteSettings } from '../../../accessors/SiteAccessors';
import classes from './SiteSettingsPage.module.scss';
import { SiteQuery, withUpsertSite, WithUpsertSiteInjectedProps } from '../../../common/SiteQuery';

interface Props {

}


const SiteSettingsPage = ({ match: { params: { siteId } }, upsertSite }: Props & RouteComponentProps<any> & WithUpsertSiteInjectedProps) =>
    <Container className={classes.root}>
        <SiteQuery
            siteId={siteId}
            component={({ site }) => {
                if (!site) {
                    return <div>not found</div>
                }

                return <SiteDataForm
                    siteId={siteId}
                    initialValues={getSiteSettings(site)}
                    handleEditSite={async (values) => {
                        await upsertSite({
                            id: site.id,
                            name: site.name,
                            data: JSON.stringify(values)
                        })
                    }}
                />
            }}
        />
    </Container>

export default withUpsertSite(SiteSettingsPage);