import * as React from 'react';
import { Modal, Dimmer, Loader } from "semantic-ui-react";
import { Asset, getAsset } from "../../accessors/AssetAccessors";
import AssetCollection from "./AssetCollection";
import { GET_ASSETS_FOR_SITE } from "../../pages/Site/Assets/AssetPage";
import { Query } from "react-apollo";

interface Props {
    trigger: React.ReactNode;
    siteId: string;
    onSelected: (asset: Asset) => void;
}

const AssetPickerModal = ({ siteId, trigger, onSelected }: Props) => <Modal trigger={trigger}>
    <Modal.Header>Choose an asset</Modal.Header>
    <Modal.Content>
        <Query query={GET_ASSETS_FOR_SITE} variables={{siteId: siteId}}>{({data, loading, error}) => {
            if (loading) {
                return <Dimmer active={loading}><Loader /></Dimmer>
            }

            return <AssetCollection onSelected={onSelected} assets={data.site.assets.map(getAsset)} />
        }}</Query>
    </Modal.Content>
</Modal>

export default AssetPickerModal;