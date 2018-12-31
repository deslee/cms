import * as React from 'react'
import { FieldProps } from 'formik';
import { Form } from 'semantic-ui-react';

interface Props {
    label?: string;
}

export default <V extends {}>(
    { field, form, label, ...rest } : Props & FieldProps<V>
) => {
    const touched: boolean = form.touched[field.name];
    const error: string = form.errors[field.name];
    return (<Form.Field>
        <Form.Input label={label} {...rest} {...field} error={Boolean(error)} />
        {touched && error && <div>{error}</div>}
    </Form.Field>)
}