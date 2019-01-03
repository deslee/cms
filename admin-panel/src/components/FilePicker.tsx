import * as React from 'react'
import { Button } from 'semantic-ui-react';

interface Props {
    handleFilePicked: (files: any) => Promise<void>;
}

class FilePicker extends React.Component<Props> {
    fileInput: HTMLInputElement;

    buttonClicked = () => {
        this.fileInput.click();
    }

    fileChanged = async (e) => {
        await this.props.handleFilePicked(this.fileInput.files);
        this.fileInput.value = null;
    }

    render() {
        return <div>
            <input onChange={this.fileChanged} ref={(ref) => {this.fileInput = ref}} type="file" style={{display: 'none'}} />
            <Button onClick={this.buttonClicked}>Upload</Button>
        </div>
    }
}

export default FilePicker;