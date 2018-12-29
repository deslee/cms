import * as React from 'react'
import { Link } from 'react-router-dom';
import { Table, Form } from 'semantic-ui-react';
import SiteDataForm from './SiteDataForm';

import styles from './SiteComponent.module.css';

interface Post {
    id: string
    title: string
    slices: any[]
}

interface Props {
    id: string
    name: string
    title: string
    subtitle?: string
    googleAnalyticsId?: string
    copyright?: string
    posts: Post[]
}


class SiteComponent extends React.Component<Props> {
    render() {

        return <div className={styles.root}>
            <h1>Site Data</h1>
            <SiteDataForm
                id={this.props.id}
                name={this.props.name}
                initialValues={{
                    title: this.props.title,
                    subtitle: this.props.subtitle,
                    copyright: this.props.copyright,
                    googleAnalyticsId: this.props.googleAnalyticsId
                }}
            />
        </div>
    }
}

export default SiteComponent;