import React from 'react';
import { useField } from 'formik';
import classNames from 'classnames';

import IconEyeOn from '@assets/icons/eye-on.svg';
import IconEyeOff from '@assets/icons/eye-off.svg';
import styles from './InputTextField.module.scss';

type InputTextPropTypes = {
    iconLeft?: string,
    iconRight?: string,
    label?: string,
    placeholder?: string,
    disabled?: boolean,
    className?: string,
    type?: string,
    onChange?: any,
    hideErrorMessage?: any,
    autoComplete?: string,
    textarea?: boolean,
    rows?: number,
    props?: any,
}

const InputTextField = ({
    iconLeft,
    iconRight,
    label,
    placeholder,
    disabled,
    className,
    classNameInput,
    type = 'text',
    onChange,
    hideErrorMessage = false,
    autoComplete = 'on',
    textarea = false,
    rows,
    ...props
}: any) => {
    const [isShow, setIsShow] = React.useState<boolean>(false);
    const [field, meta, helpers] = useField(props);
    const isError = meta.touched && meta.error && props?.required

    const onChangeValue = (evt: any) => {
        const value = evt.target.value;
        helpers?.setValue(value || '');
        onChange && onChange(value);
    }

    return (
        <div
            className={classNames(
                styles.inputTextField,
                isError && styles.error,
                className,
            )}
        >
            {label && (
                <label>
                    {label}
                    {props?.required && <span>*</span>}
                </label>
            )}
            <div className={styles.inputGroup}>
                { iconLeft && <span className={styles.iconLeft}>{iconLeft}</span> }
                {textarea ? (
                    <textarea
                        {...field}
                        placeholder={placeholder}
                        disabled={disabled}
                        autoComplete={autoComplete}
                        rows={rows}
                        className={classNames({
                            classNameInput,
                            [styles.hasIconLeft]: !!iconLeft,
                            [styles.hasIconRight]: !!iconRight
                        })}
                        onChange={onChangeValue}
                    />
                ) : (
                    <input
                        {...field}
                        type={type === 'password' ? (isShow ? 'text' : 'password') : type}
                        placeholder={placeholder}
                        disabled={disabled}
                        autoComplete={autoComplete}
                        className={classNames({
                            classNameInput,
                            [styles.hasIconLeft]: !!iconLeft,
                            [styles.hasIconRight]: !!iconRight
                        })}
                        onChange={onChangeValue}
                    />
                )}
                {type === 'password' ?
                    (
                        <button
                            type="button"
                            onClick={() => setIsShow(!isShow)}
                        >
                            <span className={styles.iconRight}>
                                {isShow ? <IconEyeOn /> : <IconEyeOff />}
                            </span>
                        </button>
                    ) : (
                        iconRight && <span className={styles.iconRight}>{iconRight}</span>
                    )
                }
            </div>
            {isError && !hideErrorMessage && (
                <div className={styles.feedback}>{meta.error}</div>
            )}
        </div>
    );
};

export default InputTextField;
