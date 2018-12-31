import * as React from 'react';
import '../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { RawDraftContentState } from 'draft-js';
import TextEditor from './Editor';
import { FieldProps } from 'formik';
import { Form } from 'semantic-ui-react';

interface Props {
    label?: string;
}

export default <V extends {}>({
    label, form: { setFieldValue },
    field: { name: fieldName, value: fieldValue }
}: Props & FieldProps<V>) => {
    let rawState: { type: string, value: RawDraftContentState };
    let initialState: RawDraftContentState | undefined = undefined;

    if (fieldValue) {
        try {
            rawState = JSON.parse(fieldValue)
        } catch (e) {
        }
    };

    if (rawState && rawState.type === 'RawDraftContentState') {
        initialState = rawState.value;
    }
    return (
        <Form.Field>
            <label>{label}</label>
            <TextEditor
                initialState={initialState}
                onChange={(rawState) => {
                    setFieldValue(fieldName, JSON.stringify({ type: 'RawDraftContentState', value: rawState }))
                }}
            />
        </Form.Field>

    )
}