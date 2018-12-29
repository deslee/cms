import * as React from 'react'
import * as Yup from 'yup';
import { Formik, FormikActions, Field } from 'formik';
import Site from './Site';
import { Form, Segment, Header, Icon, Button, Message } from 'semantic-ui-react';
import FormComponent from '../Form/FormComponent';
import TextEditor from '../Editor/Editor';
import FormikTextEditor from '../Editor/FormikTextEditor';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { mutateSafely } from '../../data/helpers';

export interface SiteFormData {
    title?: string;
    subtitle?: string;
    copyright?: string;
    googleAnalyticsId?: string;
}

const UPSERT_SITE = gql`
mutation upsertSite($site: SiteInput!) {
    upsertSite(site: $site) {
        success
        errorMessage
        data {
            id
            name
            title
            subtitle
            googleAnalyticsId
            copyright
        }
    }
}
`

const SiteFormDataSchema = Yup.object().shape({
    title: Yup.string().required('Required'),
    subtitle: Yup.string(),
    //header_image: Yup.object(),
    copyright: Yup.string(),
    googleAnalyticsId: Yup.string(),
})

interface Props {
    id?: string
    name: string
    initialValues: SiteFormData
}

class SiteDataForm extends React.Component<Props> {
    render() {
        const { id, name, initialValues } = this.props;
        return (
            <Mutation mutation={UPSERT_SITE}>{(mutate) => (
                <Formik initialValues={initialValues} validationSchema={SiteFormDataSchema} onSubmit={async (values: SiteFormData, actions: FormikActions<any>) => {
                    try {
                        await mutateSafely(mutate, { variables: { site: { id, name, ...values } } })
                    } catch (e) {
                        if (e instanceof Error) {
                            actions.setStatus(e.message)
                        } else {
                            actions.setStatus(e.toString())
                        }
                    } finally {
                        actions.setSubmitting(false)
                    }
                }}>{formik => (
                    <Form onSubmit={formik.handleSubmit} error={formik.status}>
                        <Field type="text" name="title" label="Title" component={FormComponent} />
                        <Field
                            name="subtitle"
                            label="Subtitle"
                            component={FormikTextEditor}
                        />
                        {/* <Field type="text" name="subtitle" label="Subtitle" component={FormComponent} /> */}
                        <Form.Field>
                            <label>Header Image</label>
                            {/* on click: show asset picker popup */}
                            <Segment placeholder>
                                <Header icon>
                                    <Icon name="file image outline" />
                                    No header image
                                </Header>
                            </Segment>
                        </Form.Field>
                        <Field type="text" name="copyright" label="Copyright" component={FormComponent} />
                        <div>Social media icons</div>
                        <Field type="text" name="googleAnalyticsId" label="Google Analytics ID" component={FormComponent} />
                        <Button type="submit">Save</Button>
                        <Message error header='Error' content={formik.status} />
                    </Form>
                )}</Formik>
            )}</Mutation>
        )
    }
}

export default SiteDataForm