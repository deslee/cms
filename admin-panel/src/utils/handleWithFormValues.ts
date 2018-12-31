import { FormikActions } from "formik";

export default async <TFormValues extends {}>(handleFn: (values: TFormValues) => Promise<void>, values: TFormValues, actions: FormikActions<any>) => {
    try {
        await handleFn(values);
    } catch (e) {
        if (e instanceof Error) {
            actions.setStatus(e.message)
        } else {
            actions.setStatus(e.toString())
        }
    } finally {
        actions.setSubmitting(false);
    }
};