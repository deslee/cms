import * as React from 'react'
import { FieldProps } from 'formik';
import { Form } from 'semantic-ui-react';

export default class FormComponent<V> extends React.Component<FieldProps<V>> {
    render() {
        const { field, form, ...props } = this.props;
        const touched: boolean = form.touched[field.name];
        const error: string = form.errors[field.name];
        return (<Form.Field>
            <input {...props} {...field} />
            {touched && error && <div>{error}</div>}
        </Form.Field>)
    }
}