import * as React from 'react'
import { RouteComponentProps } from 'react-router';
import { Button, Container } from 'semantic-ui-react';
import classes from './AssetPage.module.scss';
import FilePicker from '../../../components/FilePicker';
import { withApollo, WithApolloClient } from 'react-apollo';
import { config } from '../../../config';
import { withAuth, WithAuthInjectedProps } from '../../../data/auth';

interface Props {
    siteId: string;
}

const AssetPage = ({ siteId, client, auth: { user: { token } } }: Props & RouteComponentProps & WithApolloClient<Props> & WithAuthInjectedProps) => <div className={classes.root}>
    <FilePicker handleFilePicked={async (files) => {
        const data = new FormData();
        data.append('file', files[0]);
        data.append('siteId', siteId);
        const xhr = new XMLHttpRequest();

        xhr.upload.addEventListener('progress', e => {
            if (e.lengthComputable) {
                const percentage = Math.round((e.loaded * 100) / e.total);
                console.log(percentage);
            }
        }, false);

        xhr.upload.addEventListener('load', e => {
            console.log('load?')
        })

        xhr.open("POST", `${config.backendUrl}/uploadAsset`);
        xhr.setRequestHeader('Authorization', `Bearer ${token}`)

        xhr.send(data);
    }} />
</div>

export default withApollo<Props>(withAuth(AssetPage));