import * as React from 'react'
import * as Yup from 'yup';
import { Formik, Field, FieldProps, FieldArray, getIn } from 'formik';
import { Form, Segment, Header, Icon, Button, Message, Dimmer, Loader, Dropdown } from 'semantic-ui-react';
import FormComponent from '../Form/FormComponent';
import FormikTextEditor from '../Editor/FormikTextEditor';
import handleWithFormValues from '../../utils/handleWithFormValues';
import { forEachLimit } from 'async';
import posed, { PoseGroup } from 'react-pose'
const Item = posed.div()

interface ContactIconLink {
    type?: string,
    value?: string
}

export interface SiteFormData {
    title?: string;
    subtitle?: string;
    copyright?: string;
    googleAnalyticsId?: string;
    contactIcons: ContactIconLink[];
}

const ContactIconTypeOptions = [
    'Facebook', 'Instagram', 'Linkedin', 'Email', 'Youtube', 'Vimeo', 'Twitter'
].map(x => ({
    text: x,
    value: x.toLowerCase()
}));

const SiteFormDataSchema = Yup.object().shape({
    title: Yup.string().required('Required'),
    subtitle: Yup.string(),
    //header_image: Yup.object(),
    copyright: Yup.string(),
    googleAnalyticsId: Yup.string(),
    contactIcons: Yup.array().of(Yup.object().shape({
        type: Yup.string().required(),
        value: Yup.string().required()
    }))
})

interface Props {
    initialValues: SiteFormData
    handleEditSite: (values: SiteFormData) => Promise<void>;
}

const ContactIconDropdown = ({ field, form }: FieldProps) => {
    const touched: boolean = getIn(form.touched, field.name)
    const error: string = getIn(form.errors, field.name)

    return <Form.Field>
        <label>Contact Icon</label>
        <Dropdown
            value={field.value}
            onChange={(e, data) => { form.setFieldValue(field.name, data.value) }}
            options={ContactIconTypeOptions}
            selection
            placeholder="Contact Icon"
            error={Boolean(error)}
        />
        {touched && error && <div>{error}</div>}
    </Form.Field>

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
                    <FieldArray
                        name="contactIcons"
                        render={arrayHelpers => <React.Fragment>
                            <PoseGroup>
                            {
                                formik.values.contactIcons.map((contactIcon, idx, list) => <Item key={contactIcon.type || idx}>
                                    <Segment size="tiny" style={{marginBottom: '1rem'}}>
                                        <Form.Field>
                                            <Form.Group widths="equal">
                                                <Field name={`contactIcons[${idx}].type`} component={ContactIconDropdown} />
                                                <Field label="Value" name={`contactIcons[${idx}].value`} component={FormComponent} />
                                            </Form.Group>
                                        </Form.Field>
                                        <Button.Group basic>
                                            <Button disabled={idx == 0} as={'a'} icon="arrow up" onClick={() => arrayHelpers.move(idx, idx - 1)} /> />
                                            <Button disabled={idx == list.length - 1} as={'a'} icon="arrow down" onClick={() => arrayHelpers.move(idx, idx + 1)} />
                                            <Button as={'a'} icon="trash" onClick={() => arrayHelpers.remove(idx)} />
                                        </Button.Group>
                                    </Segment>
                                </Item>
                                )
                            }
                            </PoseGroup>
                            <Form.Field>
                                <Button as={'a'} onClick={() => { arrayHelpers.push({}) }} >Add social media icon</Button>
                            </Form.Field>
                        </React.Fragment>}
                    />
                    <Field type="text" name="googleAnalyticsId" label="Google Analytics ID" component={FormComponent} />
                    <Button disabled={formik.isSubmitting} type="submit">Save</Button>
                    <Message error header='Error' content={formik.status} />
                </Form>
            </div>
        )}</Formik>
    )
}

export default SiteDataForm