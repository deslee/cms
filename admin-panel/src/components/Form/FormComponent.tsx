import * as React from 'react'
import { FieldProps, getIn } from 'formik';
import { Form, FormFieldProps } from 'semantic-ui-react';

interface Props {
    label?: string;
    formFieldProps?: FormFieldProps;
}

export default <V extends {}>(
    { field, form, label, formFieldProps, ...rest } : Props & FieldProps<V>
) => {
    const touched: boolean = getIn(form.touched, field.name)
    const error: string = getIn(form.errors, field.name)
    return (<Form.Field {...formFieldProps}>
        <Form.Input label={label} {...rest} {...field} value={field.value || ''} error={Boolean(error)} />
        {touched && error && <div>{error}</div>}
    </Form.Field>)
}