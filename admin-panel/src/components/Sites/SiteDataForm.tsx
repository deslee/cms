import * as React from 'react'
import * as Yup from 'yup';
import { Formik, Field, FieldProps, FieldArray, getIn } from 'formik';
import { Form, Segment, Header, Icon, Button, Message, Dimmer, Loader, Dropdown, Image, Grid, FormFieldProps } from 'semantic-ui-react';
import FormComponent from '../Form/FormComponent';
import FormikTextEditor from '../Editor/FormikTextEditor';
import handleWithFormValues from '../../utils/handleWithFormValues';
import posed, { PoseGroup } from 'react-pose'
import classes from './SiteDataForm.module.scss';
import AssetPickerModal from '../Assets/AssetPickerModal';
import { SiteSettings, SiteSettingsSchema } from '../../accessors/SiteAccessors';
const Item = posed.div()

const ContactIconTypeOptions = [
    'Facebook', 'Instagram', 'Linkedin', 'Email', 'Youtube', 'Vimeo', 'Twitter'
].map(x => ({
    text: x,
    value: x.toLowerCase()
}));

interface Props {
    siteId: string;
    initialValues: SiteSettings
    handleEditSite: (values: SiteSettings) => Promise<void>;
}
interface State {
    assetPickerModalOpen: boolean;
}

const ContactIconDropdown = ({ field, form, ...rest }: FieldProps & FormFieldProps) => {
    const touched: boolean = getIn(form.touched, field.name)
    const error: string = getIn(form.errors, field.name)

    return <Form.Field {...rest}>
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

export default class SiteDataForm extends React.Component<Props, State> {
    state = {
        assetPickerModalOpen: false
    };

    setAssetPickerModalOpen = (assetPickerModalOpen: boolean) => this.setState({ assetPickerModalOpen })

    render() {
        const { initialValues, handleEditSite, siteId } = this.props;
        const { assetPickerModalOpen } = this.state;

        return (
            <Formik
                initialValues={initialValues}
                validationSchema={SiteSettingsSchema}
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
                        <Segment placeholder>
                            { formik.values.headerImage &&
                            <div>
                                <Grid columns="equal">
                                    <Grid.Row>
                                        <Grid.Column>
                                            <Image className={classes.headerImage} src={`${process.env.REACT_APP_BACKEND_URL}/asset/${formik.values.headerImage}?w=1200`} />
                                        </Grid.Column>
                                    </Grid.Row>
                                    <Grid.Column floated="left">
                                        <Button onClick={() => this.setAssetPickerModalOpen(true)} color="blue">Change</Button>
                                    </Grid.Column>
                                    <Grid.Column floated="right">
                                        <Button onClick={() => formik.setValues({...formik.values, headerImage: undefined})} color="red">Delete</Button>
                                    </Grid.Column>
                                </Grid>
                            </div> }
                            { !formik.values.headerImage && 
                            <Header className={classes.placeholderHeaderImage} icon onClick={() => this.setAssetPickerModalOpen(true)}>
                                <Icon name="file image outline" />
                                No header image (click to add)
                            </Header> }
                        </Segment>

                        </Form.Field>
                        <Field type="text" name="copyright" label="Copyright" component={FormComponent} />
                        <FieldArray
                            name="contactIcons"
                            render={arrayHelpers => <React.Fragment>
                                <PoseGroup>
                                    {
                                        formik.values.contactIcons.map((contactIcon, idx, list) => <Item key={contactIcon.type || idx}>
                                            <Form.Field>
                                                <Form.Group>
                                                    <Field width="7" name={`contactIcons[${idx}].type`} component={ContactIconDropdown} />
                                                    <Field formFieldProps={{width: "6"}} label="Value" name={`contactIcons[${idx}].value`} component={FormComponent} />
                                                    <Form.Button className={classes.contactIconControls} type="button" fluid disabled={idx == 0} icon="arrow up" onClick={() => arrayHelpers.move(idx, idx - 1)} />
                                                    <Form.Button className={classes.contactIconControls} type="button" fluid disabled={idx == list.length - 1} icon="arrow down" onClick={() => arrayHelpers.move(idx, idx + 1)} />
                                                    <Form.Button className={classes.contactIconControls} type="button" fluid icon="trash" onClick={() => arrayHelpers.remove(idx)} />
                                                </Form.Group>
                                            </Form.Field>
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
                    <AssetPickerModal
                        open={assetPickerModalOpen}
                        siteId={siteId}
                        onSelected={asset => {
                            formik.setValues({
                                ...formik.values,
                                headerImage: asset.id
                            })
                            this.setAssetPickerModalOpen(false)
                        }}
                        onClose={() => this.setAssetPickerModalOpen(false)}
                    />
                </div>
            )}</Formik>
        )
    }
}