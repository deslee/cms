import * as React from 'react'
import { FieldProps } from 'formik';

export default class FormComponent<V> extends React.Component<FieldProps<V>> {
    render() {
        const { field, form, ...props } = this.props;
        const touched: boolean = form.touched[field.name];
        const error: string = form.errors[field.name];

        return (<div>
            <input {...props} {...field} />
            {touched && error && <div>{error}</div>}
        </div>)
    }
}