import * as React from 'react'
import { Formik, Field } from 'formik';
import * as Yup from 'yup';
import FormComponent from '../Form/FormComponent';
import { Button, Form, Message, Dimmer, Loader } from 'semantic-ui-react'
import classes from './LoginForm.module.css'
import handleWithFormValues from '../../utils/handleWithFormValues';

export interface LoginFormValues {
    email: string
    password: string
}

const LoginFormSchema = Yup.object().shape({
    email: Yup.string()
        .required("Required"),
    password: Yup.string()
        .required("Required")
})

const initialValues = { email: '', password: '' };

interface LoginFormProps {
    handleLogin: (values: LoginFormValues) => Promise<void>
}

export default ({ handleLogin }: LoginFormProps) => (
    <Formik
        initialValues={initialValues}
        validationSchema={LoginFormSchema}
        onSubmit={(values, actions) => handleWithFormValues(handleLogin, values, actions)}
    >{formik => (
        <div>
            <Dimmer active={formik.isSubmitting}> <Loader /> </Dimmer>
            <Form onSubmit={formik.handleSubmit} error={formik.status} className={classes.root}>
                <Field type="email" name="email" label="Email" component={FormComponent} />
                <Field type="password" name="password" label="Password" component={FormComponent} />
                <Message error header='Error' content={formik.status} />
                <Button type="submit">Submit</Button>
            </Form>
        </div>
    )}</Formik>
)