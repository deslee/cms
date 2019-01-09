import * as React from 'react';
import { Modal, Dimmer, Loader, ModalProps } from "semantic-ui-react";
import AssetCollection from "./AssetCollection";
import { GetAssetsForSiteQuery, Asset } from '../../common/AssetQuery';

interface Props {
    siteId: string;
    onSelected: (asset: Asset) => void;
}

const AssetPickerModal = ({ siteId, onSelected, ...rest }: Props & ModalProps) => <Modal {...rest}>
    <Modal.Header>Choose an asset</Modal.Header>
    <Modal.Content>
        <GetAssetsForSiteQuery siteId={siteId}
            component={({assets}) => <AssetCollection onSelected={onSelected} assets={assets} />}
        />
    </Modal.Content>
</Modal>

export default AssetPickerModal;