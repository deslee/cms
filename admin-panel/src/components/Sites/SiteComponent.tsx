import * as React from 'react'
import { Link } from 'react-router-dom';
import { Table, Form } from 'semantic-ui-react';
import SiteDataForm from './SiteDataForm';

import styles from './SiteComponent.module.scss';
import { Site } from '../../models/models';

interface Props {
    site: Site;
}

const SiteComponent = (props: Props) => {
    const { site } = props;
    return <div className={styles.root}>
        <SiteDataForm
            id={site.id}
            name={site.name}
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