import * as React from 'react';
import '../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { EditorState, RawDraftContentState, convertFromRaw, ContentState, convertToRaw } from 'draft-js';
import TextEditor from './Editor';
import { FieldProps } from 'formik';
import { Form } from 'semantic-ui-react';

interface State {
}

interface Props {
    label?: string;
}

class FormikTextEditor<V> extends React.Component<Props & FieldProps<V>, State> {
    constructor(props: Props & FieldProps<V>) {
        super(props);
    }

    render() {
        let rawState: { type: string, value: RawDraftContentState };
        let initialState: RawDraftContentState | undefined = undefined;

        if (this.props.field.value) {
            try {
                rawState = JSON.parse(this.props.field.value)
                console.log(rawState);
            } catch (e) {
                console.error(e);
            }
        };

        if (rawState && rawState.type === 'RawDraftContentState') {
            initialState = rawState.value;
        }
        return (
            <Form.Field>
                <label>{this.props.label}</label>
                <TextEditor
                    initialState={initialState}
                    onChange={(rawState) => {
                        this.props.form.setFieldValue(this.props.field.name, JSON.stringify({ type: 'RawDraftContentState', value: rawState }))
                    }}
                />
            </Form.Field>

        )
    }
}

export default FormikTextEditor;