import * as React from 'react'
import { Link } from 'react-router-dom';
import { Table, Form } from 'semantic-ui-react';
import SiteDataForm from './SiteDataForm';

import styles from './SiteComponent.module.scss';
import { Site } from '../../models/models';

interface Post {
    id: string
    title: string
    slices: any[]
}

interface Props {
    site: Site;
}


class SiteComponent extends React.Component<Props> {
    render() {
        const { site } = this.props;
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
}

export default SiteComponent;