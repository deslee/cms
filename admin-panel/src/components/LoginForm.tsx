import * as React from 'react'
import { Formik, FormikActions, Field, FieldProps } from 'formik';
import * as Yup from 'yup';
import FormComponent from './Form/FormComponent';

export interface LoginFormValues {
    email: string
    password: string
}

const initialValues = { email: '', password: '' };

const LoginFormSchema = Yup.object().shape({
    email: Yup.string()
        .required("Required"),
    password: Yup.string()
        .required("Required")
})

interface Props {
    handleLogin: (values: LoginFormValues) => Promise<void>
}

class LoginForm extends React.Component<Props> {
    handleSubmit = async (values: LoginFormValues, actions: FormikActions<any>) => {
        const { handleLogin } = this.props;
        try {
            await handleLogin(values);
        } catch(e) {
            console.error(e);
            if (e instanceof Error) {
                actions.setStatus(e.message)
            } else {
                actions.setStatus(e.toString())
            }
        } finally {
            actions.setSubmitting(false);
        }
    }

    render() {
        return (
            <Formik
                initialValues={initialValues}
                validationSchema={LoginFormSchema}
                onSubmit={this.handleSubmit}
            >{formik => (
                <form onSubmit={formik.handleSubmit}>
                    <Field type="email" name="email" placeholder="Email" component={FormComponent} />
                    <Field type="password" name="password" placeholder="Password" component={FormComponent} />
                    {formik.status && <div>{formik.status}</div>}
                    <button type="submit">Submit</button>
                </form>
            )}</Formik>
        )
    }
}

export default LoginForm;