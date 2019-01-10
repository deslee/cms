import * as React from 'react'
import * as Yup from 'yup';
import { Post } from '../../accessors/PostAccessors';
import { Formik, Field } from 'formik';
import handleWithFormValues from '../../utils/handleWithFormValues';
import FormComponent from '../Form/FormComponent';
import { Form, Button, Message } from 'semantic-ui-react';

interface Props {
    initialValues: Post
    handleSubmitPost: (values: Post) => Promise<void>
}
interface State {

}

export default class PostForm extends React.Component<Props, State> {
    render() {
        const { 
            initialValues,
            handleSubmitPost
        } = this.props;
        return <Formik 
            initialValues={initialValues}
            onSubmit={(values, actions) => handleWithFormValues(handleSubmitPost, values, actions)}
        >{formik => (<Form onSubmit={formik.handleSubmit} error={Boolean(formik.status)}>
            <Field type="text" name="title" label="Title" component={FormComponent} />
            <Field type="date" name="date" label="Date" component={FormComponent} />
            <Field type="text" name="password" label="Optional Password" component={FormComponent} />
            {/* Slices */}
            <Message error header='Error' content={formik.status} />
            <Button type="submit">Submit</Button>
        </Form>)}</Formik>
    }
}