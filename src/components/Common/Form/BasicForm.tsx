import React from 'react';
import { Formik, Form } from 'formik';

const BasicForm = ({
    children,
    initialValues,
    onSubmit,
    validationSchema,
    className,
    id,
    formikRef,
    onChange,
    ...rest
}: any) => (
    <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
        innerRef={formikRef}
        {...rest}
    >
        {() => (
            <Form id={id} className={className} onChange={onChange}>
                {children}
            </Form>
        )}
    </Formik>
);

export default BasicForm;
