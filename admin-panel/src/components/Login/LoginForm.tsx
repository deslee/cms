import * as React from 'react'
import { Formik, FormikActions, Field } from 'formik';
import * as Yup from 'yup';
import FormComponent from '../Form/FormComponent';
import { Button, Form, Message, Dimmer, Loader } from 'semantic-ui-react'
import classes from './LoginForm.module.css'

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
        onSubmit={async (values: LoginFormValues, actions: FormikActions<any>) => {
            try {
                await handleLogin(values);
            } catch (e) {
                if (e instanceof Error) {
                    actions.setStatus(e.message)
                } else {
                    actions.setStatus(e.toString())
                }
            } finally {
                actions.setSubmitting(false);
            }
        }
        }
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