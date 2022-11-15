import React from 'react';
import { useField } from 'formik';
import classNames from 'classnames';

import styles from './CheckBoxField.module.scss';

const CheckboxField = ({
    children,
    name,
    disabled,
    className,
    checkboxCenter = true,
    ...rest
}: any) => {
    const [field, meta] = useField({ name });
    return (
        <div
            className={classNames(
                className,
                styles.pcCheckboxField,
                meta.touched && meta.error && styles.error,
                checkboxCenter && styles.checkboxCenter
            )}
        >
            <input
                type="checkbox"
                {...field}
                checked={field.value}
                {...rest}
                disabled={disabled}
                id={name}
            />
            <span className={styles.checkmark} />
            <label htmlFor={name}>
                {children}
            </label>
        </div>
    );
};

export default CheckboxField;
