import * as React from 'react'
import { FieldProps } from 'formik';
import { Form } from 'semantic-ui-react';

interface Props {
    label?: string;
}

export default class FormComponent<V> extends React.Component<Props & FieldProps<V>> {
    render() {
        const { field, form, label, ...props } = this.props;
        const touched: boolean = form.touched[field.name];
        const error: string = form.errors[field.name];
        return (<Form.Field>
            <Form.Input label={label} {...props} {...field} error={Boolean(error)} />
            {touched && error && <div>{error}</div>}
        </Form.Field>)
    }
}