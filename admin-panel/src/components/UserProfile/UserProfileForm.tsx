import * as React from 'react'
import * as Yup from 'yup'
import { Formik, Field } from 'formik';
import handleWithFormValues from '../../utils/handleWithFormValues';
import { Dimmer, Loader, Form, Button, Message } from 'semantic-ui-react';
import FormComponent from '../Form/FormComponent';

interface UserProfileFormData {
    name: string
    email: string
}

const UserProfileFormDataSchema = Yup.object().shape({
    name: Yup.string().required(),
    email: Yup.string().email().required()
})

interface Props {
    initialValues: UserProfileFormData;
    className?: any;
    handleEditUserProfile: (values: UserProfileFormData) => Promise<void>
}

const UserProfileForm = ({initialValues, handleEditUserProfile, ...rest}: Props) => <Formik 
    initialValues={initialValues}
    validationSchema={UserProfileFormDataSchema}
    onSubmit={(values, actions) => handleWithFormValues(handleEditUserProfile, values, actions)}
>{({isSubmitting, status, handleSubmit}) => <div {...rest}>
    <Dimmer active={isSubmitting}><Loader /></Dimmer>
    <Form onSubmit={handleSubmit} error={Boolean(status)}>
        <Field type="text" name="name" label="Name" component={FormComponent} />
        <Field type="text" name="email" label="Email" component={FormComponent} />
        <Message error header='Error' content={status} />
        <Button type="submit">Submit</Button>
    </Form>
</div>}</Formik>

export default UserProfileForm;

