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
    posts: Post[]
}


class SiteComponent extends React.Component<Props> {
    render() {
        const {
            name,
            posts
        } = this.props;

        return <div className={styles.root}>
            <h1>Site Data</h1>
            <SiteDataForm initialValues={{
                heading: name
            }} />
        </div>
    }
}

export default SiteComponent;