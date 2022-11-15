import React from 'react';
import classNames from 'classnames';

import styles from './Button.module.scss';


interface ButtonType {
    children?: any,
    className?: any,
    buttonStyle?: any ,
    fullWidth?: any ,
    disabled?: any ,
    type? : "button" | "submit" | 'reset',
    onClick?: any 
};

const Button: React.FC<ButtonType> = ({
    children,
    className,
    buttonStyle = 'primary',
    fullWidth = false,
    type = "button",
    onClick,
    disabled,
    ...props
}) => {
    return (
        <button
            type = {type}
            {...props}
            onClick = {onClick}
            disabled={disabled}
            className={classNames(
                className,
                styles.button,
                styles[buttonStyle] || styles.primary,
                {[styles.fullWidth]: fullWidth}
            )}
        >
            {children}
        </button>
    );
};

export default Button;