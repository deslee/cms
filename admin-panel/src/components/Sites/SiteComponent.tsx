import * as React from 'react'
import { Link } from 'react-router-dom';
import { Table, Form } from 'semantic-ui-react';
import SiteDataForm, { SiteFormData } from './SiteDataForm';

import styles from './SiteComponent.module.scss';
import { Site } from '../../models/models';

interface Props {
    site: Site;
    handleEditSite: (values: SiteFormData) => Promise<void>;
}

const SiteComponent = (props: Props) => {
    const { site, handleEditSite } = props;
    return <div className={styles.root}>
        <SiteDataForm
            handleEditSite={handleEditSite}
            initialValues={{
                title: site.title,
                subtitle: site.subtitle,
                copyright: site.copyright,
                googleAnalyticsId: site.googleAnalyticsId
            }}
        />
    </div>
}

export default SiteComponent;