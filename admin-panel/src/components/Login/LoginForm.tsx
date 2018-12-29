import * as React from 'react'
import { Formik, FormikActions, Field } from 'formik';
import * as Yup from 'yup';
import FormComponent from '../Form/FormComponent';
import { Button, Form, Message, Segment as div, Dimmer, Loader } from 'semantic-ui-react'
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import { mutateSafely } from '../../data/helpers';
import { AuthUser, WithAuthInjectedProps, withAuth } from '../../data/auth';
import classes from './LoginForm.module.css'

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

class LoginFormComponent extends React.Component<Props> {
    handleSubmit = async (values: LoginFormValues, actions: FormikActions<any>) => {
        const { handleLogin } = this.props;
        try {
            await handleLogin(values);
        } catch (e) {
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
    }
}

const LOGIN = gql`
    mutation Login($login: LoginInput!) {
        login(login: $login) {
            success,
            errorMessage,
            data {
                id
                email
                name
            }
            token
        }
    }
`;

interface LoginFormProps {
    loginSuccess: (authUser: AuthUser) => void
}

const LoginForm = ({ auth: { updateUser }, loginSuccess }: LoginFormProps & WithAuthInjectedProps) => <Mutation mutation={LOGIN}>
    {(mutate) => (
        <LoginFormComponent
            handleLogin={async (credentials) => {
                var response = await mutateSafely(mutate, { variables: { login: { email: credentials.email, password: credentials.password } } });
                let result = response && response.data.login;
                if (!result.success) {
                    throw new Error(result.errorMessage || "Failed login");
                }
                const authUser: AuthUser = {
                    email: result.data.email,
                    name: result.data.name,
                    token: result.token
                };
                await updateUser(authUser);
                loginSuccess(authUser);
            }} />
    )}
</Mutation>

export default withAuth<LoginFormProps>(LoginForm);