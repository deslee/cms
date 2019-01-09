import * as React from 'react'
import { Image, Button, Confirm } from 'semantic-ui-react';
import { Asset } from '../../common/AssetQuery';

interface Props {
    asset: Asset
    onDelete: () => Promise<void>;
}
interface State {
    confirmOpen: boolean;
}

class AssetDetail extends React.Component<Props & React.HTMLAttributes<HTMLDivElement>, State> {
    state = {
        confirmOpen: false
    }

    open = () => this.setState({ confirmOpen: true })
    close = () => this.setState({ confirmOpen: false })

    render() {
        const { asset, onDelete, ...rest } = this.props;
        return <div {...rest}>
            <Image src={`${process.env.REACT_APP_BACKEND_URL}/asset/${asset.id}`} />
            <Button onClick={this.open} color="red">Delete</Button>
            <Confirm open={this.state.confirmOpen} onCancel={this.close} onConfirm={() => onDelete()} />
        </div>
    }
}

export default AssetDetail;