import * as React from 'react'
import { Card, Image, Grid, CardProps } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import classes from './AssetCollection.module.scss';
import { Asset } from '../../common/AssetQuery';

interface Props {
    assets: Asset[];
    onSelected?: (asset: Asset) => void;
}

const AssetCollection = ({ assets, onSelected }: Props) => {
    return <div>
        <Grid padded={true} columns={4}>
            {assets.map(asset => {

                // by default, have each asset take you to their page when you click on them
                const cardProps: CardProps = onSelected ? {
                    onClick: () => onSelected(asset)
                } : {
                    as: Link,
                    to: `assets/${asset.id}`
                }

                return <Grid.Column key={asset.id}>
                    <Card {...cardProps}>
                        {asset.state === "RESIZED" ? <Image src={`${process.env.REACT_APP_BACKEND_URL}/asset/${asset.id}`} /> : <div>processing</div>}
                        <Card.Content>
                            <Card.Header className={classes.assetHeader}>
                                {asset.fileName}
                            </Card.Header>
                            <Card.Meta>
                                {asset.type}
                            </Card.Meta>
                        </Card.Content>

                    </Card>

                </Grid.Column>
            })}
        </Grid>
    </div>
}

export default AssetCollection;