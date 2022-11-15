import classNames from 'classnames';
import { useField } from 'formik';
import React from 'react';

import styles from './SelectAddressField.module.scss';

const SelectAddressField = ({
    children,
    className,
    onChange,
    ...props
}: any) => {
    const [field, meta] = useField(props);

    const isChecked = meta.value === props.value

    const handleChange = (e: any) => {
        field.onChange(e)
        onChange && onChange(e)
    }

    return (
        <div className={classNames(
            styles.pcRadioButton,
            className,
            isChecked && styles.checked
        )}>
            <label className={styles.container}>
                <span className={styles.checkmark} />
                <div>
                    {children}
                </div>
                <input
                    type="radio"
                    checked={isChecked}
                    {...field}
                    {...props}
                    onChange={handleChange}
                />
            </label>
        </div>
    );
};

export default SelectAddressField;