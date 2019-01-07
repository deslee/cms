import * as React from 'react';
import { Modal, Dimmer, Loader } from "semantic-ui-react";
import AssetCollection from "./AssetCollection";
import { GetAssetsForSiteQuery, Asset } from '../../common/AssetQuery';

interface Props {
    trigger: React.ReactNode;
    siteId: string;
    onSelected: (asset: Asset) => void;
}

const AssetPickerModal = ({ siteId, trigger, onSelected }: Props) => <Modal trigger={trigger}>
    <Modal.Header>Choose an asset</Modal.Header>
    <Modal.Content>
        <GetAssetsForSiteQuery siteId={siteId}
            component={({assets}) => <AssetCollection onSelected={onSelected} assets={assets} />}
        />
    </Modal.Content>
</Modal>

export default AssetPickerModal;