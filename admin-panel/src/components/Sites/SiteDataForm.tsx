import * as React from 'react'
import * as Yup from 'yup';
import { Formik, FormikActions, Field } from 'formik';
import { Form, Segment, Header, Icon, Button, Message, Dimmer, Loader } from 'semantic-ui-react';
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

const SiteDataForm = (props: Props) => {
    const { id, name, initialValues } = props;
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
                <div>
                    <Dimmer active={formik.isSubmitting}>
                        <Loader />
                    </Dimmer>
                    <Form onSubmit={formik.handleSubmit} error={formik.status}>
                        <Field type="text" name="title" label="Title" component={FormComponent} />
                        <Field
                            name="subtitle"
                            label="Subtitle"
                            component={FormikTextEditor}
                        />
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
                        <Button disabled={formik.isSubmitting} type="submit">Save</Button>
                        <Message error header='Error' content={formik.status} />
                    </Form>
                </div>
            )}</Formik>
        )}</Mutation>
    )
}

export default SiteDataForm