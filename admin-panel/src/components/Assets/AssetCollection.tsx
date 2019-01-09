import * as React from 'react'
import { Card, Image, CardProps } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import classes from './AssetCollection.module.scss';
import { Asset } from '../../common/AssetQuery';

interface Props {
    assets: Asset[];
    onSelected?: (asset: Asset) => void;
}

const AssetCollection = ({ assets, onSelected, ...rest }: Props & React.HTMLAttributes<HTMLDivElement>) => {
    return <div {...rest}>
        <Card.Group itemsPerRow={4}>
            {assets.map(asset => {

                // by default, have each asset take you to their page when you click on them
                const cardProps: CardProps = onSelected ? {
                    onClick: () => onSelected(asset)
                } : {
                        as: Link,
                        to: `assets/${asset.id}`
                    }
                    
                return <Card {...cardProps} key={asset.id}>
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
            })}
        </Card.Group>
    </div>
}

export default AssetCollection;