import * as React from 'react'
import * as Yup from 'yup';
import { Formik, FormikActions, Field } from 'formik';
import Site from './Site';
import { Form, Segment, Header, Icon } from 'semantic-ui-react';
import FormComponent from '../Form/FormComponent';

export interface SiteFormData {
    heading?: string;
    subheading?: string;
    copyright?: string;
    googleAnalyticsId?: string;
}

const SiteFormDataSchema = Yup.object().shape({
    heading: Yup.string().required('Required'),
    subheading: Yup.string(),
    //header_image: Yup.object(),
    copyright: Yup.string(),
    googleAnalyticsId: Yup.string(),
})

interface Props {
    initialValues: SiteFormData
}

class SiteDataForm extends React.Component<Props> {
    handleSubmit = async (values: any, actions: FormikActions<any>) => {

    }

    render() {
        const { initialValues } = this.props;
        return (
            <Formik initialValues={initialValues} validationSchema={SiteFormDataSchema} onSubmit={this.handleSubmit}>{formik => (
                <Form onSubmit={formik.handleSubmit} error={formik.status}>
                    <Field type="text" name="heading" label="Heading" component={FormComponent} />
                    <Field type="text" name="subheading" label="Subheading" component={FormComponent} />
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
                </Form>
            )}</Formik>
        )
    }
}

export default SiteDataForm