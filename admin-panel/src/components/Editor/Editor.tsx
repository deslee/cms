import * as React from 'react';
import { Editor } from 'react-draft-wysiwyg';
import '../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { EditorState, RawDraftContentState, convertFromRaw, ContentState, convertToRaw } from 'draft-js';

interface State {
    editorState: EditorState
}

interface Props {
    onChange: (rawState: RawDraftContentState) => void;
    initialState?: RawDraftContentState;
    className?: string;
}

const toolbar = {
    options: ['inline', 'blockType', 'fontSize', 'list', 'textAlign', 'link', 'emoji', 'history']
}

class TextEditor extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        let editorState: EditorState;

        if (props.initialState) {
            try {
                editorState = EditorState.createWithContent(convertFromRaw(props.initialState));
            } catch (ex) {
                console.error(ex);
                editorState = EditorState.createEmpty();
            }
        } else {
            editorState = EditorState.createEmpty();
        }

        this.state = {
            editorState
        }
    }

    onEditorStateChange = (editorState: EditorState) => {
        const { onChange } = this.props;
        this.setState({
            editorState
        })
        onChange(convertToRaw(editorState.getCurrentContent()))
    }

    render() {
        const { editorState } = this.state;
        const { className } = this.props;
        return (
            <div>
                <Editor
                    editorClassName={className}
                    editorState={editorState}
                    onEditorStateChange={this.onEditorStateChange}
                    toolbar={toolbar}
                />
            </div>

        )
    }
}

export default TextEditor;