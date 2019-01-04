import * as React from 'react'
import { Asset } from '../../accessors/AssetAccessors';
import { Card, Image, Grid } from 'semantic-ui-react';
import { config } from '../../config';
import { Link } from 'react-router-dom';
import classes from './AssetCollection.module.scss';

interface Props {
    assets: Asset[]
}

const AssetCollection = ({ assets }: Props) => <div>
    <Grid padded={true} columns={4}>
        {assets.map(asset => <Grid.Column key={asset.id}>
            <Card as={Link} to={`assets/${asset.id}`}>
                <Image src={`${config.backendUrl}/asset/${asset.id}${asset.extension}`} />

                <Card.Content>
                    <Card.Header className={classes.assetHeader}>
                        {asset.fileName}
                    </Card.Header>
                    <Card.Meta>
                        {asset.type}
                    </Card.Meta>
                </Card.Content>

            </Card>

        </Grid.Column>)}
    </Grid>
</div>

export default AssetCollection;