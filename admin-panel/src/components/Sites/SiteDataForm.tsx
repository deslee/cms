import * as React from 'react'
import * as Yup from 'yup';
import { Formik, Field } from 'formik';
import { Form, Segment, Header, Icon, Button, Message, Dimmer, Loader } from 'semantic-ui-react';
import FormComponent from '../Form/FormComponent';
import FormikTextEditor from '../Editor/FormikTextEditor';
import handleWithFormValues from '../../utils/handleWithFormValues';

enum ContactType {
    FACEBOOK, INSTAGRAM, LINKEDIN, EMAIL, YOUTUBE, VIMEO, TWITTER
}

interface ContactIconLink {
    type?: ContactType,
    url?: string
}

export interface SiteFormData {
    title?: string;
    subtitle?: string;
    copyright?: string;
    googleAnalyticsId?: string;
    contactIcons?: ContactIconLink[];
}

const SiteFormDataSchema = Yup.object().shape({
    title: Yup.string().required('Required'),
    subtitle: Yup.string(),
    //header_image: Yup.object(),
    copyright: Yup.string(),
    googleAnalyticsId: Yup.string(),
    contactIcons: Yup.array().of(Yup.object().shape({
        type: Yup.string().required(),
        url: Yup.string().required()
    }))
})

interface Props {
    initialValues: SiteFormData
    handleEditSite: (values: SiteFormData) => Promise<void>;
}

const SiteDataForm = (props: Props) => {
    const { initialValues, handleEditSite } = props;
    return (
        <Formik
            initialValues={initialValues}
            validationSchema={SiteFormDataSchema}
            onSubmit={(values, actions) => handleWithFormValues(handleEditSite, values, actions)}
        >{formik => (
            <div>
                <Dimmer active={formik.isSubmitting}>
                    <Loader />
                </Dimmer>
                <Form onSubmit={formik.handleSubmit} error={Boolean(formik.status)}>
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
                    {(formik.values['contactIcons'] || []).map((contactIcon, idx) => <Field name={`contactIcons[${idx}]`} component={(f) => <div>{JSON.stringify(f)}</div>} />)}
                    <Button as={'a'} onClick={() => {
                        var v = (formik.values['contactIcons'] || [])
                        v.push({

                        });
                        formik.setFieldValue('contactIcons', v);
                    }} >Add social media icon</Button>
                    <Field type="text" name="googleAnalyticsId" label="Google Analytics ID" component={FormComponent} />
                    <Button disabled={formik.isSubmitting} type="submit">Save</Button>
                    <Message error header='Error' content={formik.status} />
                </Form>
            </div>
        )}</Formik>
    )
}

export default SiteDataForm